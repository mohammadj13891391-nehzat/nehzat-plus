using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using EducationalPlatform.Nehzat.Application.DTOs;
using EducationalPlatform.Nehzat.Application.Interfaces;

namespace EducationalPlatform.Nehzat.API.Controllers
{
    [ApiController]
    [Route("api/learning")]
    [Authorize]
    public class LearningController : ControllerBase
    {
        private readonly ILearningService _service;

        public LearningController(ILearningService service)
        {
            _service = service;
        }

        // ========== LearningPath endpoints ==========

        [HttpGet("paths")]
        public async Task<IActionResult> GetAllPaths()
        {
            return Ok(await _service.GetAllPathsAsync());
        }

        [HttpGet("paths/{id}")]
        public async Task<IActionResult> GetPathById(int id)
        {
            var result = await _service.FindPathByIdAsync(id);
            if (result == null) return NotFound(new { message = "مسیر یادگیری یافت نشد." });
            return Ok(result);
        }

        [HttpPost("paths")]
        public async Task<IActionResult> CreatePath([FromBody] CreateLearningPathRequest request)
        {
            var result = await _service.CreatePathAsync(request);
            return Ok(result);
        }

        [HttpPut("paths/{id}")]
        public async Task<IActionResult> UpdatePath(int id, [FromBody] UpdateLearningPathRequest request)
        {
            try
            {
                var result = await _service.UpdatePathAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("paths/{id}")]
        public async Task<IActionResult> DeletePath(int id)
        {
            try
            {
                await _service.DeletePathAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("paths/{id}/tree")]
        public async Task<IActionResult> GetPathTree(int id)
        {
            try
            {
                var result = await _service.GetPathTreeAsync(id);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ========== LearningLevel endpoints ==========

        [HttpGet("paths/{pathId}/levels")]
        public async Task<IActionResult> GetLevels(int pathId)
        {
            return Ok(await _service.GetLevelsAsync(pathId));
        }

        [HttpGet("levels/{id}")]
        public async Task<IActionResult> GetLevelById(int id)
        {
            var result = await _service.FindLevelByIdAsync(id);
            if (result == null) return NotFound(new { message = "سطح یادگیری یافت نشد." });
            return Ok(result);
        }

        [HttpPost("levels")]
        public async Task<IActionResult> CreateLevel([FromBody] CreateLearningLevelRequest request)
        {
            try
            {
                var result = await _service.CreateLevelAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("levels/{id}")]
        public async Task<IActionResult> UpdateLevel(int id, [FromBody] UpdateLearningLevelRequest request)
        {
            try
            {
                var result = await _service.UpdateLevelAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("levels/{id}")]
        public async Task<IActionResult> DeleteLevel(int id)
        {
            try
            {
                await _service.DeleteLevelAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ========== StudyModule endpoints ==========

        [HttpGet("levels/{levelId}/modules")]
        public async Task<IActionResult> GetModules(int levelId)
        {
            return Ok(await _service.GetModulesAsync(levelId));
        }

        [HttpGet("modules/{id}")]
        public async Task<IActionResult> GetModuleById(int id)
        {
            var result = await _service.FindModuleByIdAsync(id);
            if (result == null) return NotFound(new { message = "ماژول آموزشی یافت نشد." });
            return Ok(result);
        }

        [HttpPost("modules")]
        public async Task<IActionResult> CreateModule([FromBody] CreateStudyModuleRequest request)
        {
            try
            {
                var result = await _service.CreateModuleAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("modules/{id}")]
        public async Task<IActionResult> UpdateModule(int id, [FromBody] UpdateStudyModuleRequest request)
        {
            try
            {
                var result = await _service.UpdateModuleAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("modules/{id}")]
        public async Task<IActionResult> DeleteModule(int id)
        {
            try
            {
                await _service.DeleteModuleAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ========== StudyLesson endpoints ==========

        [HttpGet("modules/{moduleId}/lessons")]
        public async Task<IActionResult> GetLessons(int moduleId)
        {
            return Ok(await _service.GetLessonsAsync(moduleId));
        }

        [HttpGet("lessons/{id}")]
        public async Task<IActionResult> GetLessonById(int id)
        {
            var result = await _service.FindLessonByIdAsync(id);
            if (result == null) return NotFound(new { message = "درس یافت نشد." });
            return Ok(result);
        }

        [HttpPost("lessons")]
        public async Task<IActionResult> CreateLesson([FromBody] CreateStudyLessonRequest request)
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
        public async Task<IActionResult> UpdateLesson(int id, [FromBody] UpdateStudyLessonRequest request)
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

        // ========== ContentBlock endpoints ==========

        [HttpGet("lessons/{lessonId}/content")]
        public async Task<IActionResult> GetContentBlocks(int lessonId)
        {
            return Ok(await _service.GetContentBlocksAsync(lessonId));
        }

        [HttpPost("content-blocks")]
        public async Task<IActionResult> CreateContentBlock([FromBody] CreateContentBlockRequest request)
        {
            try
            {
                var result = await _service.CreateContentBlockAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("content-blocks/{id}")]
        public async Task<IActionResult> UpdateContentBlock(int id, [FromBody] UpdateContentBlockRequest request)
        {
            try
            {
                var result = await _service.UpdateContentBlockAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("content-blocks/{id}")]
        public async Task<IActionResult> DeleteContentBlock(int id)
        {
            try
            {
                await _service.DeleteContentBlockAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ========== Quiz endpoints ==========

        [HttpGet("lessons/{lessonId}/quizzes")]
        public async Task<IActionResult> GetQuizzes(int lessonId)
        {
            return Ok(await _service.GetQuizzesAsync(lessonId));
        }

        [HttpGet("quizzes/{id}")]
        public async Task<IActionResult> GetQuizById(int id)
        {
            var result = await _service.FindQuizByIdAsync(id);
            if (result == null) return NotFound(new { message = "کوئیز یافت نشد." });
            return Ok(result);
        }

        [HttpPost("quizzes")]
        public async Task<IActionResult> CreateQuiz([FromBody] CreateLearningQuizRequest request)
        {
            try
            {
                var result = await _service.CreateQuizAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("quizzes/{id}")]
        public async Task<IActionResult> UpdateQuiz(int id, [FromBody] UpdateLearningQuizRequest request)
        {
            try
            {
                var result = await _service.UpdateQuizAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("quizzes/{id}")]
        public async Task<IActionResult> DeleteQuiz(int id)
        {
            try
            {
                await _service.DeleteQuizAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpGet("quizzes/{quizId}/questions")]
        public async Task<IActionResult> GetQuizQuestions(int quizId)
        {
            return Ok(await _service.GetQuizQuestionsAsync(quizId));
        }

        // ========== Question endpoints ==========

        [HttpPost("questions")]
        public async Task<IActionResult> CreateQuestion([FromBody] CreateLearningQuizQuestionRequest request)
        {
            try
            {
                var result = await _service.CreateQuestionAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("questions/{id}")]
        public async Task<IActionResult> UpdateQuestion(int id, [FromBody] UpdateLearningQuizQuestionRequest request)
        {
            try
            {
                var result = await _service.UpdateQuestionAsync(id, request);
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

        // ========== Option endpoints ==========

        [HttpPost("options")]
        public async Task<IActionResult> CreateOption([FromBody] CreateQuizOptionRequest request)
        {
            try
            {
                var result = await _service.CreateOptionAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("options/{id}")]
        public async Task<IActionResult> UpdateOption(int id, [FromBody] UpdateQuizOptionRequest request)
        {
            try
            {
                var result = await _service.UpdateOptionAsync(id, request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("options/{id}")]
        public async Task<IActionResult> DeleteOption(int id)
        {
            try
            {
                await _service.DeleteOptionAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ========== Enrollment endpoints ==========

        [HttpPost("enroll")]
        public async Task<IActionResult> EnrollUser([FromBody] EnrollUserRequest request)
        {
            try
            {
                var result = await _service.EnrollUserAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
        }

        [HttpGet("users/{userId}/enrollments")]
        public async Task<IActionResult> GetUserEnrollments(int userId)
        {
            return Ok(await _service.GetUserEnrollmentsAsync(userId));
        }

        [HttpPut("enrollments/{id}/status")]
        public async Task<IActionResult> UpdateEnrollmentStatus(int id, [FromQuery] string status)
        {
            try
            {
                var result = await _service.UpdateEnrollmentStatusAsync(id, status);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ========== Lesson Progress endpoints ==========

        [HttpPost("lessons/{lessonId}/complete")]
        public async Task<IActionResult> CompleteLesson(int lessonId, [FromQuery] int enrollmentId)
        {
            try
            {
                var result = await _service.CompleteLessonAsync(enrollmentId, lessonId);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpPut("lessons/{lessonId}/progress")]
        public async Task<IActionResult> UpdateLessonProgress(int lessonId, [FromQuery] int enrollmentId, [FromQuery] string status, [FromQuery] int? score = null)
        {
            try
            {
                var result = await _service.UpdateLessonProgressAsync(enrollmentId, lessonId, status, score);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        // ========== Quiz Submission ==========

        [HttpPost("quizzes/{quizId}/submit")]
        public async Task<IActionResult> SubmitQuiz(int quizId, [FromBody] SubmitQuizRequest request)
        {
            if (request.QuizId != quizId)
                return BadRequest(new { message = "شناسه کوئیز مطابقت ندارد." });

            try
            {
                var result = await _service.SubmitQuizAsync(request);
                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("users/{userId}/quizzes/{quizId}/attempts")]
        public async Task<IActionResult> GetUserQuizAttempts(int userId, int quizId)
        {
            return Ok(await _service.GetUserQuizAttemptsAsync(userId, quizId));
        }

        // ========== Dashboard ==========

        [HttpGet("users/{userId}/dashboard")]
        public async Task<IActionResult> GetUserDashboard(int userId)
        {
            return Ok(await _service.GetUserDashboardAsync(userId));
        }
    }
}
