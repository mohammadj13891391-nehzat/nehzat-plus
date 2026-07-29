using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers
{
    [ApiController]
    [Route("api/experimental-science")]
    [Authorize]
    public class ExperimentalScienceController : ControllerBase
    {
        private readonly IExperimentalScienceService _service;

        public ExperimentalScienceController(IExperimentalScienceService service)
        {
            _service = service;
        }

        // ========== Topic endpoints ==========

        [HttpGet("topics")]
        public async Task<IActionResult> GetAllTopics([FromQuery] string? difficulty = null)
        {
            return Ok(await _service.GetAllTopicsAsync(difficulty));
        }

        [HttpGet("topics/{id}")]
        public async Task<IActionResult> GetTopicById(int id)
        {
            var result = await _service.GetTopicByIdAsync(id);
            if (result == null) return NotFound(new { message = "موضوع یافت نشد." });
            return Ok(result);
        }

        [HttpPost("topics")]
        public async Task<IActionResult> CreateTopic([FromBody] CreateExperimentTopicRequest request)
        {
            try
            {
                var result = await _service.CreateTopicAsync(request);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("topics/{id}")]
        public async Task<IActionResult> UpdateTopic(int id, [FromBody] UpdateExperimentTopicRequest request)
        {
            try
            {
                var result = await _service.UpdateTopicAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("topics/{id}")]
        public async Task<IActionResult> DeleteTopic(int id)
        {
            try
            {
                await _service.DeleteTopicAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("topics/search")]
        public async Task<IActionResult> SearchTopics([FromQuery] string q, [FromQuery] int max = 20)
        {
            return Ok(await _service.SearchTopicsAsync(q, max));
        }

        // ========== Experiment endpoints ==========

        [HttpGet("experiments")]
        public async Task<IActionResult> GetAllExperiments([FromQuery] int? topicId = null, [FromQuery] string? difficulty = null)
        {
            return Ok(await _service.GetAllExperimentsAsync(topicId, difficulty));
        }

        [HttpGet("experiments/{id}")]
        public async Task<IActionResult> GetExperimentById(int id)
        {
            var result = await _service.GetExperimentByIdAsync(id);
            if (result == null) return NotFound(new { message = "آزمایش یافت نشد." });
            return Ok(result);
        }

        [HttpPost("experiments")]
        public async Task<IActionResult> CreateExperiment([FromBody] CreateExperimentRequest request)
        {
            try
            {
                var result = await _service.CreateExperimentAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("experiments/{id}")]
        public async Task<IActionResult> UpdateExperiment(int id, [FromBody] UpdateExperimentRequest request)
        {
            try
            {
                var result = await _service.UpdateExperimentAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("experiments/{id}")]
        public async Task<IActionResult> DeleteExperiment(int id)
        {
            try
            {
                await _service.DeleteExperimentAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("experiments/search")]
        public async Task<IActionResult> SearchExperiments([FromQuery] string q, [FromQuery] int max = 20)
        {
            return Ok(await _service.SearchExperimentsAsync(q, max));
        }

        // ========== Analysis endpoints ==========

        [HttpGet("experiments/{experimentId}/analyses")]
        public async Task<IActionResult> GetAnalysesByExperiment(int experimentId)
        {
            return Ok(await _service.GetAnalysesByExperimentAsync(experimentId));
        }

        [HttpPost("experiments/{experimentId}/analyses")]
        public async Task<IActionResult> CreateAnalysis(int experimentId, [FromBody] CreateExperimentAnalysisRequest request)
        {
            try
            {
                var result = await _service.CreateAnalysisAsync(request with { ExperimentId = experimentId });
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("analyses/{id}")]
        public async Task<IActionResult> UpdateAnalysis(int id, [FromBody] UpdateExperimentAnalysisRequest request)
        {
            try
            {
                var result = await _service.UpdateAnalysisAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("analyses/{id}")]
        public async Task<IActionResult> DeleteAnalysis(int id)
        {
            try
            {
                await _service.DeleteAnalysisAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ========== Question endpoints ==========

        [HttpGet("experiments/{experimentId}/questions")]
        public async Task<IActionResult> GetQuestionsByExperiment(int experimentId)
        {
            return Ok(await _service.GetQuestionsByExperimentAsync(experimentId));
        }

        [HttpPost("experiments/{experimentId}/questions")]
        public async Task<IActionResult> CreateQuestion(int experimentId, [FromBody] CreateExperimentQuestionRequest request)
        {
            try
            {
                var result = await _service.CreateQuestionAsync(request with { ExperimentId = experimentId });
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("questions/{id}")]
        public async Task<IActionResult> DeleteQuestion(int id)
        {
            try
            {
                await _service.DeleteQuestionAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ========== Attempt endpoints ==========

        [HttpPost("attempts")]
        public async Task<IActionResult> SubmitAttempt([FromBody] SubmitExperimentAttemptRequest request)
        {
            try
            {
                var result = await _service.SubmitAttemptAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("attempts/student/{studentId}")]
        public async Task<IActionResult> GetAttemptsByStudent(int studentId)
        {
            return Ok(await _service.GetAttemptsByStudentAsync(studentId));
        }

        // ========== Progress endpoints ==========

        [HttpGet("progress/{studentId}")]
        public async Task<IActionResult> GetProgress(int studentId, [FromQuery] int experimentId)
        {
            var result = await _service.GetProgressAsync(studentId, experimentId);
            if (result == null) return NotFound(new { message = "پیشرفتی یافت نشد." });
            return Ok(result);
        }

        [HttpPut("progress")]
        public async Task<IActionResult> UpdateProgress([FromBody] UpdateExperimentProgressRequest request)
        {
            try
            {
                var result = await _service.UpdateProgressAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("progress/{studentId}/overall")]
        public async Task<IActionResult> GetOverallProgress(int studentId)
        {
            return Ok(await _service.GetOverallProgressAsync(studentId));
        }

        // ========== Dashboard ==========

        [HttpGet("dashboard-stats")]
        [AllowAnonymous]
        public async Task<IActionResult> GetDashboardStats()
        {
            var stats = await _service.GetDashboardStatsAsync();
            return Ok(stats);
        }
    }
}