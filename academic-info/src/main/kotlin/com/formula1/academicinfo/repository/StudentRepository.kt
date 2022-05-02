package com.formula1.academicinfo.repository
import com.formula1.academicinfo.model.Curriculum
import com.formula1.academicinfo.model.Student
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface StudentRepository: JpaRepository<Student, Int> {
    @Query("SELECT s.curriculums FROM Student s WHERE s.studentId=:sid")
    fun getCurriculumsByStudentId(@Param("sid") id: Int): MutableSet<Curriculum>
}