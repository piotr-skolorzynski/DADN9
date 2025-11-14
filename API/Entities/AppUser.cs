namespace API.Entities;

public class AppUser
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string DisplayName { get; set; }
    public required string Email { get; set; }
    //hash and salt password, temp solution
    public string? ImageUrl { get; set; }
    public required byte[] Password { get; set; }
    public required byte[] PasswordSalt { get; set; }

    //Nav property
    public Member Member { get; set; } = null!;
}
