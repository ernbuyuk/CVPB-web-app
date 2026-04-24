using System.Text.Json;

namespace backend.Contracts;

public sealed class PipelineStepDto
{
    public string Type { get; set; } = string.Empty;

    public Dictionary<string, JsonElement>? Params { get; set; }
}

public sealed class CreatePipelineRequest
{
    public string Name { get; set; } = string.Empty;

    public List<PipelineStepDto> Pipeline { get; set; } = new();
}

public sealed class PipelineResponse
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public List<PipelineStepDto> Pipeline { get; set; } = new();

    public DateTimeOffset CreatedAt { get; set; }
}
