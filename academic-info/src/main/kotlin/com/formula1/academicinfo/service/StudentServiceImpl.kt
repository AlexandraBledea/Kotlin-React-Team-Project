package com.formula1.academicinfo.service

import com.formula1.academicinfo.dtos.FacultyandSpecializationDto
import com.formula1.academicinfo.dtos.GradeDto
import com.formula1.academicinfo.dtos.OptionalDisciplineDto
import com.formula1.academicinfo.model.Faculty
import com.formula1.academicinfo.model.OptionalsSelection
import com.formula1.academicinfo.model.Teacher
import com.formula1.academicinfo.model.YearOfStudy
import com.formula1.academicinfo.repository.*
import org.springframework.stereotype.Service

@Service
class StudentServiceImpl (
    private val studentRepository: StudentRepository,
    private val userRepository: UserRepository,
    private val optionalDisciplineRepository: OptionalDisciplineRepository,
    private val teacherRepository: TeacherRepository,
    private val curriculumRepository: CurriculumRepository,
    private val gradeRepository: GradeRepository,
    private val optionalsSelectionRepository: OptionalsSelectionRepository

        ): StudentService{
    override fun getOptionalDisciplines(username: String, facultyId: Int): MutableSet<OptionalDisciplineDto> {

        val teacherList: Set<Teacher> = teacherRepository.findTeachersByFacultyId(facultyId)

        val optionals = mutableSetOf<OptionalDisciplineDto>()
        for(teacher in teacherList)
            for(optional in teacher.disciplines) {
                if(optional.isOptional){
                    val optionalDiscipline = optionalDisciplineRepository.getOptionalDisciplineByODisciplineId(optional.disciplineId)
                    if(optionalDiscipline.approved){
                        val u = this.userRepository.findUserById(teacher.teacherId)
                        val opt = this.optionalDisciplineRepository.getOptionalDisciplineByODisciplineId(optional.disciplineId)

                        val o = OptionalDisciplineDto(optional.disciplineId, optional.disciplineName, opt.maxAttendants, optional.creditCount, u.fullName)

//                        o.disciplineName = optional.disciplineName
//                        o.oDisciplineId = optional.disciplineId
//                        o.creditCount = optional.creditCount
//                        o.teacherName = u.fullName
//                        o.maxAttendants = opt.maxAttendants

                        optionals.add(o)
                    }
                }
            }

        return optionals
    }

    override fun getSpecializations(username: String, facultyId: Int): MutableSet<YearOfStudy> {
        val user = this.userRepository.findUserByUsername(username)

        val student = user.let { this.studentRepository.getStudentByStudentId(it.userId) }

        val yearsOfStudy = mutableSetOf<YearOfStudy>()
        for(yos in student.yearsOfStudyStudent)
                if(yos.facultyYos.facultyId == facultyId){
                    yearsOfStudy.add(yos)
                }

        return yearsOfStudy
    }

    override fun getFaculties(username: String): MutableSet<Faculty> {
        val user = this.userRepository.findUserByUsername(username)

        val student = user.let { this.studentRepository.getStudentByStudentId(it.userId) }

        val faculties = mutableSetOf<Faculty>()
        for(yos in student.yearsOfStudyStudent)
                faculties.add(yos.facultyYos)

        return faculties
    }

    override fun getFacultiesAndSpecializations(username: String): MutableSet<FacultyandSpecializationDto> {
        val user = this.userRepository.findUserByUsername(username)

        val student = user.let { this.studentRepository.getStudentByStudentId(it.userId) }

        val yearsOfStudy = student.yearsOfStudyStudent

        val result = mutableSetOf<FacultyandSpecializationDto>()

        for(year in yearsOfStudy){
                val options = FacultyandSpecializationDto()

                options.studentId = student.studentId
                options.facultyName = year.facultyYos.facultyName
                options.yosId = year.yosId
                options.specialization = year.specialization
                options.yearNo = year.yearNo

                result.add(options)

            }

        return result
    }

    override fun getGrades(username: String, yosId: Int): MutableSet<GradeDto> {

        val user = this.userRepository.findUserByUsername(username)

        val student = user.let { this.studentRepository.getStudentByStudentId(it.userId) }

        val curriculum = this.curriculumRepository.findCurriculumByCurriculumYos(yosId)

        val result = mutableSetOf<GradeDto>()

        for(discipline in curriculum.disciplines){
            for(grade in student.grades) {
                    if(grade.gradeDiscipline.disciplineId == discipline.disciplineId){
                        val g = GradeDto()

                        g.isOptional = discipline.isOptional
                        g.creditCount = discipline.creditCount
                        g.disciplineName = discipline.disciplineName
                        g.value = grade.value.toString()

                        result.add(g)
                    }
                }

        }

        return result

    }

    override fun addOptionalDiscipline(username: String, disciplineName: String, priority: Int) : String {
        val discipline = optionalDisciplineRepository.getOptionalDisciplineByName(disciplineName)
        val user = userRepository.findUserByUsername(username)
        val student = studentRepository.getStudentByStudentId(user.userId)

        optionalsSelectionRepository.save(student.createOptional(discipline, priority))
        return "Added"
    }

    override fun getOptionals(): MutableList<OptionalsSelection> {
        return optionalsSelectionRepository.findAll();
    }

    override fun checkIfUserIsStudent(username: String): Boolean {
        return studentRepository.getStudentByUsername(username) != null
    }

}



//val grade = this.gradeRepository.findGradeByGradeId(GradeId(student.studentId, discipline.disciplineId))
//val g = GradeDto()
//
//g.isOptional = discipline.isOptional
//g.creditCount = discipline.creditCount
//g.disciplineName = discipline.disciplineName
//if (grade != null) {
//    g.value = grade.value.toString()
//}