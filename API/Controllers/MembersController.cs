using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MembersController( IMemberRepository membersRepository) : BaseApiController
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

    }
}
