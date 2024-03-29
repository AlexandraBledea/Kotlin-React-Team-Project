package com.formula1.academicinfo.service

import com.formula1.academicinfo.dtos.OptionalDisciplineChiefDto
import com.formula1.academicinfo.dtos.TeacherPerfDto
import com.formula1.academicinfo.dtos.TeacherPerformanceDto
import com.formula1.academicinfo.model.Discipline
import com.formula1.academicinfo.model.Teacher
import com.formula1.academicinfo.model.User
import com.formula1.academicinfo.repository.*
import org.springframework.stereotype.Service

@Service
class ChiefOfDepartmentImplService(private val optionalsDisciplineRepository: OptionalDisciplineRepository,
                                   private val disciplineRepository: DisciplineRepository,
                                   private val teacherRepository: TeacherRepository,
                                   private val userRepository: UserRepository,
                                   private val facultyRepository: FacultyRepository
): ChiefOfDepartmentService {

    override fun getOptionals(username: String): MutableSet<OptionalDisciplineChiefDto> {
        val user = this.userRepository.findUserByUsername(username)
        val teacher = this.teacherRepository.findTeacherByTeacherId(user.userId)
        val facultyId = teacher.faculty.facultyId

        val teachers = this.teacherRepository.findTeachersByFacultyId(facultyId)

        val optionals = mutableSetOf<OptionalDisciplineChiefDto>()

        for(t in teachers)
            for(discipline in t.disciplines) {
                if (discipline.isOptional) {
                    val optional =
                        this.optionalsDisciplineRepository.getOptionalDisciplineByODisciplineId(discipline.disciplineId)

                    if (!optional.approved) {

                        val o = OptionalDisciplineChiefDto()
                        val u = this.userRepository.findUserById(t.teacherId)
                        o.teacherName = u.fullName
                        o.creditCount = discipline.creditCount
                        o.oDisciplineId = discipline.disciplineId
                        o.disciplineName = discipline.disciplineName

                        optionals.add(o)
                    }
                }
            }

        return optionals
    }

    override fun approveOptional(optionalId: Int, maxAttendants: Int): String {

        if(maxAttendants < 20){
            return "The number of maximum attendants must be at least 20"
        }

        val rowsAffected = this.optionalsDisciplineRepository.update(optionalId, true, maxAttendants)

        if(rowsAffected > 0){
            return "Optional approved successfully!"
        }

        return "Error while approving the optional!"
    }

    override fun getDisciplinesGivenByTeacher(teacherId: Int) : List<Discipline> {
        return disciplineRepository.findDisciplinesByTeacherId(teacherId)
    }

    override fun getTeachers(facultyId: Int): Set<Teacher> {
        return teacherRepository.findTeachersByFacultyId(facultyId)
    }

    override fun getTeachersWithName(facultyId: Int): Set<User> {
        return teacherRepository.findTeachersWithName(facultyId)
    }

    override fun checkIfUserIsChiefOfDepartment(username: String): Boolean {
        val teacherId = teacherRepository.findTeacherByUsername(username)?.teacherId
        teacherId?.let {
            return facultyRepository.findFacultyByChiefOfDepartmentId(it) != null
        }
        return false
    }

    override fun getBestTeacher(username: String): TeacherPerformanceDto {
        val chief = teacherRepository.findTeacherByUsername(username)
        val dto = teacherRepository.findBestTeachers(chief!!.teacherId).first()
        return TeacherPerformanceDto(userRepository.findUserById(dto.teacherId).fullName, dto.performance)
    }

    override fun getWorstTeacher(username: String): TeacherPerformanceDto {
        val chief = teacherRepository.findTeacherByUsername(username)
        val dto = teacherRepository.findBestTeachers(chief!!.teacherId).last()
        return TeacherPerformanceDto(userRepository.findUserById(dto.teacherId).fullName, dto.performance)
    }
}










//        val user = this.userRepository.findUserByUsername(username)
//
//        val teacher = this.teacherRepository.findTeacherByTeacherId(user.userId)
//
//        val facultyId = teacher.faculty?.facultyId
//
//        val faculty = facultyId?.let { facultyRepository.getFacultiesByFacultyId(it) }
//
//        val chiefOfDepartmentId = faculty?.teacherFaculty?.teacherId
//
//        if(chiefOfDepartmentId == teacher.teacherId){
//
//
//
//        }