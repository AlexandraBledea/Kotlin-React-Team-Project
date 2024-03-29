package com.formula1.academicinfo.service

import com.formula1.academicinfo.dtos.AllStudentsResultDto
import com.formula1.academicinfo.dtos.StudentResultDto
import com.formula1.academicinfo.dtos.YearStudentsDto
import com.formula1.academicinfo.dtos.YearStudentsResultDto
import com.formula1.academicinfo.repository.AdminRepository
import com.formula1.academicinfo.repository.StudentRepository
import com.formula1.academicinfo.repository.UserRepository
import org.springframework.stereotype.Service
import kotlin.streams.toList

@Service
class AdminServiceImpl(
    val adminRepository: AdminRepository,
    val studentRepository: StudentRepository,
    val userRepository: UserRepository) : AdminService {
    override fun getStudentsByResults(username: String) : List<StudentResultDto> {
        val adminId = adminRepository.findAdminByUsername(username)!!.adminId;
        val initial = adminRepository.getStudentsByResults(adminId)
        return initial.stream().map {
            val student = studentRepository.getStudentByStudentId(it.studentId)
            val user = userRepository.findUserById(it.studentId)
            return@map StudentResultDto(user.fullName, student.group, it.gradeAverage)
        }.toList()
    }

    override fun checkIfUserIsAdmin(username: String): Boolean {
        val a = adminRepository.findAdminByUsername(username)
        return a != null
    }

    override fun getAllStudentsByResults(username: String): List<AllStudentsResultDto> {
        val adminId = adminRepository.findAdminByUsername(username)!!.adminId;
        val initial = adminRepository.getStudentsByResultsDecreasing(adminId)
        return initial.stream().map {
            val user = userRepository.findUserById(it.studentId)
            return@map AllStudentsResultDto(user.fullName, it.gradeAverage)
        }.toList()
    }
    override fun getStudentsForEachYearByResult(username: String): List<YearStudentsDto> {
        val adminId = adminRepository.findAdminByUsername(username)!!.adminId;
        val initial = adminRepository.getStudentsForEachYearByResults(adminId)
        return initial.stream().map {
            val user = userRepository.findUserById(it.student_id)
            return@map YearStudentsDto(user.fullName, it.year_number, it.grade)
        }.toList()
    }
}