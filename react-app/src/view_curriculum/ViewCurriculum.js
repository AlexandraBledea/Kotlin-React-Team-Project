import React from "react";
import "./ViewCurriculum.css";
import { UserContext } from "../App";

let url = "localhost:1337/view_curriculum?q=react";

function Discipline({ curr_discipline, index }) {
	return (
		<React.Fragment>
			<tr>
				<td className="Curriculum-table-body-item">{curr_discipline.discipline_type}</td>
				<td className="Curriculum-table-body-item">{curr_discipline.discipline_name}</td>
				<td className="Curriculum-table-body-item">{curr_discipline.teacher_name}</td>
				<td className="Curriculum-table-body-item">{curr_discipline.credit_count}</td>
			</tr>
		</React.Fragment>
	);
}

function Curriculum({ curr_curriculum, index }) {
	return (
		<React.Fragment>
			<option>{curr_curriculum.specialisation + " - year " + curr_curriculum.yearOfStudy}</option>
		</React.Fragment>
	);
}

function DisciplineList({ discipline_array }) {
	return (
		<>
			{discipline_array.map((discipline, i) => (
				<Discipline curr_discipline={discipline} index={i} />
			))}
		</>
	);
}

async function curriculumSelectHandler({ event, setOption, setCurriculum }) {
	console.log(event.target.value);
	setOption(event.target.value);
}

function CurriculumList({ curriculum_array, setCurriculum }) {
	let [selectedOption, setOption] = React.useState("Select");

	return (
		<>
			<select
				className="Curriculum-selector"
				onChange={(e) => {
					curriculumSelectHandler(e, setOption, setCurriculum);
				}}
				value={selectedOption}
			>
				{curriculum_array.map((curriculum, i) => (
					<Curriculum curr_curriculum={curriculum} index={i} />
				))}
			</select>
		</>
	);
}

function ViewCurriculum() {
	let [curriculums, setCurriculums] = React.useState([]);
	let [selectedCurriculum, setSelected] = React.useState({});
	let [disciplines, setDisciplines] = React.useState([]);

	const userData = React.useContext(UserContext);

	React.useEffect(() => {
		let url = "http://localhost:1337/http://localhost:8090/user/getCurriculum/";
		url += userData.user_id;

		// data = [{discipline_type: mandatory/optional, discipline_name: ..., teacher_name: ..., credit_count: ...}, ...]

		if (true /*curriculums === []*/) {
			/*
            fetch(url)
            .then(response => response.json())
            .then(data => setCurriculums(data));
            */
			setCurriculums([
				{ specialisation: "Computer Science in English", yearOfStudy: 1 },
				{ specialisation: "Computer Science in English", yearOfStudy: 2 },
			]);
		}

		if (selectedCurriculum !== {}) {
			/*

            url += "/" + {selectedCurriculum.yearOfStudy};
            fetch(url)
            .then(response => response.json())
            .then(data => setDisciplines(data))
            
             */

			if (selectedCurriculum.yearOfStudy == 2) {
				setDisciplines([
					{ discipline_type: "mandatory", discipline_name: "Systems For Design & Implementation", teacher_name: "Dr. Gaceanu", credit_count: 6 },
					{ discipline_type: "optional", discipline_name: "A/V Data Processing", teacher_name: "Forest", credit_count: 4 },
				]);
			} else {
				setDisciplines([
					{ discipline_type: "mandatory", discipline_name: "Data Structures & Algorithms", teacher_name: "Zsu", credit_count: 5 },
					{ discipline_type: "optional", discipline_name: "C Programming", teacher_name: "Grebla", credit_count: 3 },
				]);
			}
		}
	}, [userData.user_id, userData.full_name]);

	return (
		<>
			<CurriculumList curriculum_array={curriculums} setCurriculum={setSelected} />

			<table cellSpacing="0" cellPadding="12" className="Curriculum-table">
				<thead>
					<tr>
						<td className="Curriculum-table-head-item">Type</td>
						<td className="Curriculum-table-head-item">Name</td>
						<td className="Curriculum-table-head-item">Teacher</td>
						<td className="Curriculum-table-head-item">Credits</td>
					</tr>
				</thead>
				<tbody>
					<DisciplineList discipline_array={disciplines} />
				</tbody>
			</table>
		</>
	);
}

export default ViewCurriculum;
