using System.Text.Json;
using backend.Contracts;
using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class PipelinesController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public PipelinesController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<PipelineResponse>>> GetAll(CancellationToken cancellationToken)
    {
        var entities = await _dbContext.Pipelines
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync(cancellationToken);

        return Ok(entities.Select(ToResponse));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<PipelineResponse>> GetById(int id, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Pipelines
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (entity is null)
        {
            return NotFound();
        }

        return Ok(ToResponse(entity));
    }

    [HttpPost]
    public async Task<ActionResult<PipelineResponse>> Create(
        [FromBody] CreatePipelineRequest request,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest("Pipeline name is required.");
        }

        var entity = new PipelineDefinition
        {
            Name = request.Name.Trim(),
            Json = JsonSerializer.Serialize(request.Pipeline),
            CreatedAt = DateTimeOffset.UtcNow
        };

        _dbContext.Pipelines.Add(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        var response = ToResponse(entity);
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
    {
        var entity = await _dbContext.Pipelines
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        if (entity is null)
        {
            return NotFound();
        }

        _dbContext.Pipelines.Remove(entity);
        await _dbContext.SaveChangesAsync(cancellationToken);

        return NoContent();
    }

    private static PipelineResponse ToResponse(PipelineDefinition entity)
    {
        var steps = JsonSerializer.Deserialize<List<PipelineStepDto>>(entity.Json) ?? new List<PipelineStepDto>();

        return new PipelineResponse
        {
            Id = entity.Id,
            Name = entity.Name,
            Pipeline = steps,
            CreatedAt = entity.CreatedAt
        };
    }
}
