using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers
{
    [ApiController]
    [Route("api/arabic-literature")]
    [Authorize]
    public class ArabicLiteratureController : ControllerBase
    {
        private readonly IArabicLiteratureService _service;

        public ArabicLiteratureController(IArabicLiteratureService service)
        {
            _service = service;
        }

        // ========== Poet endpoints ==========

        [HttpGet("poets")]
        public async Task<IActionResult> GetAllPoets([FromQuery] string? difficulty = null)
        {
            return Ok(await _service.GetAllPoetsAsync(difficulty));
        }

        [HttpGet("poets/{id}")]
        public async Task<IActionResult> GetPoetById(int id)
        {
            var result = await _service.FindPoetByIdAsync(id);
            if (result == null) return NotFound(new { message = "شاعر یافت نشد." });
            return Ok(result);
        }

        [HttpPost("poets")]
        public async Task<IActionResult> CreatePoet([FromBody] CreateArabicPoetRequest request)
        {
            try
            {
                var result = await _service.CreatePoetAsync(request);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("poets/{id}")]
        public async Task<IActionResult> UpdatePoet(int id, [FromBody] UpdateArabicPoetRequest request)
        {
            try
            {
                var result = await _service.UpdatePoetAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("poets/{id}")]
        public async Task<IActionResult> DeletePoet(int id)
        {
            try
            {
                await _service.DeletePoetAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("poets/search")]
        public async Task<IActionResult> SearchPoets([FromQuery] string q, [FromQuery] int max = 20)
        {
            var results = await _service.SearchPoetsAsync(q, max);
            return Ok(results);
        }

        // ========== Poem endpoints ==========

        [HttpGet("poems")]
        public async Task<IActionResult> GetAllPoems([FromQuery] int? poetId = null, [FromQuery] string? genre = null, [FromQuery] string? difficulty = null)
        {
            return Ok(await _service.GetAllPoemsAsync(poetId, genre, difficulty));
        }

        [HttpGet("poems/{id}")]
        public async Task<IActionResult> GetPoemById(int id)
        {
            var result = await _service.FindPoemByIdAsync(id);
            if (result == null) return NotFound(new { message = "شعر یافت نشد." });
            return Ok(result);
        }

        [HttpPost("poems")]
        public async Task<IActionResult> CreatePoem([FromBody] CreateArabicPoemRequest request)
        {
            try
            {
                var result = await _service.CreatePoemAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("poems/{id}")]
        public async Task<IActionResult> UpdatePoem(int id, [FromBody] UpdateArabicPoemRequest request)
        {
            try
            {
                var result = await _service.UpdatePoemAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("poems/{id}")]
        public async Task<IActionResult> DeletePoem(int id)
        {
            try
            {
                await _service.DeletePoemAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("poems/search")]
        public async Task<IActionResult> SearchPoems([FromQuery] string q, [FromQuery] int max = 20)
        {
            var results = await _service.SearchPoemsAsync(q, max);
            return Ok(results);
        }

        // ========== Analysis endpoints ==========

        [HttpGet("poems/{poemId}/analyses")]
        public async Task<IActionResult> GetAnalysesByPoem(int poemId)
        {
            return Ok(await _service.GetAnalysesByPoemAsync(poemId));
        }

        [HttpGet("analyses/{id}")]
        public async Task<IActionResult> GetAnalysisById(int id)
        {
            var result = await _service.FindAnalysisByIdAsync(id);
            if (result == null) return NotFound(new { message = "تحلیل یافت نشد." });
            return Ok(result);
        }

        [HttpPost("analyses")]
        public async Task<IActionResult> CreateAnalysis([FromBody] CreateArabicAnalysisRequest request)
        {
            try
            {
                var result = await _service.CreateAnalysisAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("analyses/{id}")]
        public async Task<IActionResult> UpdateAnalysis(int id, [FromBody] UpdateArabicAnalysisRequest request)
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

        // ========== Curriculum / Course endpoints ==========

        [HttpGet("courses")]
        public async Task<IActionResult> GetAllCourses([FromQuery] string? level = null)
        {
            return Ok(await _service.GetAllCoursesAsync(level));
        }

        [HttpGet("courses/{id}")]
        public async Task<IActionResult> GetCourseById(int id)
        {
            var result = await _service.FindCourseByIdAsync(id);
            if (result == null) return NotFound(new { message = "دوره یافت نشد." });
            return Ok(result);
        }

        [HttpPost("courses")]
        public async Task<IActionResult> CreateCourse([FromBody] CreateArabicCourseRequest request)
        {
            try
            {
                var result = await _service.CreateCourseAsync(request);
                return Ok(result);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpPut("courses/{id}")]
        public async Task<IActionResult> UpdateCourse(int id, [FromBody] UpdateArabicCourseRequest request)
        {
            try
            {
                var result = await _service.UpdateCourseAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("courses/{id}")]
        public async Task<IActionResult> DeleteCourse(int id)
        {
            try
            {
                await _service.DeleteCourseAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ========== Lesson endpoints ==========

        [HttpGet("courses/{courseId}/lessons")]
        public async Task<IActionResult> GetLessonsByCourse(int courseId)
        {
            return Ok(await _service.GetLessonsByCourseAsync(courseId));
        }

        [HttpGet("lessons/{id}")]
        public async Task<IActionResult> GetLessonById(int id)
        {
            var result = await _service.FindLessonByIdAsync(id);
            if (result == null) return NotFound(new { message = "درس یافت نشد." });
            return Ok(result);
        }

        [HttpPost("lessons")]
        public async Task<IActionResult> CreateLesson([FromBody] CreateArabicLessonRequest request)
        {
            try
            {
                var result = await _service.CreateLessonAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("lessons/{id}")]
        public async Task<IActionResult> UpdateLesson(int id, [FromBody] UpdateArabicLessonRequest request)
        {
            try
            {
                var result = await _service.UpdateLessonAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("lessons/{id}")]
        public async Task<IActionResult> DeleteLesson(int id)
        {
            try
            {
                await _service.DeleteLessonAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ========== Progress endpoints ==========

        [HttpGet("progress")]
        public async Task<IActionResult> GetUserProgress()
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "کاربر یافت نشد." });

            return Ok(await _service.GetUserProgressAsync(userId));
        }

        [HttpGet("courses/{courseId}/progress")]
        public async Task<IActionResult> GetUserProgressByCourse(int courseId)
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "کاربر یافت نشد." });

            return Ok(await _service.GetUserProgressByCourseAsync(userId, courseId));
        }

        [HttpPost("progress")]
        public async Task<IActionResult> UpdateProgress([FromBody] UpdateArabicProgressRequest request)
        {
            var userIdClaim = User.FindFirst("userId")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "کاربر یافت نشد." });

            try
            {
                var result = await _service.UpdateProgressAsync(userId, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
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
