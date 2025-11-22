using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MembersController( IMemberRepository membersRepository, IPhotoService photoService) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Member>>> GetMemebers()
        {
            return Ok(await membersRepository.GetMembersAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Member>> GetMemeber(string id)
        {
            var member = await membersRepository.GetMemberByIdAsync(id);

            if (member == null) return NotFound();

            return member;
        }

        [HttpGet("{id}/photos")]
        public async Task<ActionResult<IReadOnlyList<Photo>>> GetMemberPhotos(string id)
        {
            return Ok(await membersRepository.GetPhotosForMemberAsync(id));
        }

        [HttpPut]
        public async Task<ActionResult> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var memberId = User.GetMemberId();

            if (memberId == null) return BadRequest("Oops - no id found in token");

            var member = await membersRepository.GetMemberForUpdate(memberId);

            if (member == null) return BadRequest("Could not get member");

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName; 
            member.Description = memberUpdateDto.Description ?? member.Description; 
            member.City = memberUpdateDto.City ?? member.City; 
            member.Country = memberUpdateDto.Country ?? member.Country; 

            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

            // membersRepository.Update(member); //optional

            if (await membersRepository.SaveAllAsync()) return NoContent(); //returns 402

            return BadRequest("Failed to update member");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<Photo>> AddPhoto([FromForm] IFormFile file)
        {
            var member = await membersRepository.GetMemberForUpdate(User.GetMemberId());

            if (member == null ) return BadRequest("Cannot update member");

            var result = await photoService.UploadPhotoAsync(file);

            if (result.Error != null) return BadRequest(result.Error.Message);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId= result.PublicId,
                MemberId = User.GetMemberId()
            };
            
            if (member.ImageUrl == null)
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            }

            member.Photos.Add(photo);

            if (await membersRepository.SaveAllAsync()) return photo;

            return BadRequest("Problem adding photo");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var member = await membersRepository.GetMemberForUpdate(User.GetMemberId());

            if (member == null) return BadRequest("Cannot get member from token");

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if (member.ImageUrl == photo?.Url || photo == null) return BadRequest("Cannot set this as main image");

            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;

            if (await membersRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Problem setting main photo");
        }
    }
}
