namespace backend.Models;

public sealed class PipelineDefinition
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Json { get; set; } = "[]";

    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
}
