import React from "react";
import "./AddGrades.css";
import { MDBDataTable } from "mdbreact";
import { UserContext } from "../App";

let baseUrl = "http://localhost:1337/http://localhost:8090/teacher/";

function handlePutGrade(event, userData, discipline, student, grade, set, setMsg) {
	event.preventDefault();

	const gReqOptions = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "origin",
			Authorization: "Bearer " + userData.auth_token,
		},
		body: JSON.stringify({
			disciplineId: discipline,
			studentId: student,
			value: grade,
		}),
	};

	const gRequest = new Request(baseUrl + "addGrade", gReqOptions);

	fetch(gRequest)
		.then((response) => {
			return response.text();
		})
		.then((data) => {
			setMsg(data);
			set(-1);
		});
}

function IdForm({ discipline, set, msg }) {
	let [localStudent, setLocalStudent] = React.useState("");

	if (discipline != -1) {
		return (
			<>
				<form
					className="Id-input"
					onSubmit={(event) => {
						event.preventDefault();
						set(localStudent);
					}}
				>
					<input
						type="text"
						placeholder="Student ID"
						onChange={(event) => {
							setLocalStudent(event.target.value);
						}}
					></input>
					<button type="submit">Select</button>
				</form>
				<p>{msg}</p>
			</>
		);
	}
}

function GradeForm({ user, discipline, student, set, setMsg }) {
	let [localGrade, setLocalGrade] = React.useState("");

	if (student != -1) {
		return (
			<form className="Grade-input" onSubmit={(e) => handlePutGrade(e, user, discipline, student, localGrade, set, setMsg)}>
				<input
					type="text"
					placeholder="Grade"
					onChange={(event) => {
						setLocalGrade(event.target.value);
					}}
				></input>
				<button type="submit">Put grade</button>
			</form>
		);
	}
}

function AddGrades() {
	const userData = React.useContext(UserContext);
	const dataTableColumns = [
		{
			label: "ID",
			field: "studentId",
			sort: "asc",
			width: 70,
		},
		{
			label: "Name",
			field: "studentName",
			sort: "asc",
			width: 180,
		},
		{
			label: "Group",
			field: "group",
			sort: "asc",
			width: 70,
		},
	];

	let [disciplinesList, setDisciplinesList] = React.useState([]);
	let [selectedDiscipline, setSelectedDiscipline] = React.useState(-1);
	let [dataTableModel, setDataTableModel] = React.useState({ columns: dataTableColumns, rows: [] });
	let [selectedStudent, setSelectedStudent] = React.useState(-1);
	let [message, setMessage] = React.useState("");

	React.useEffect(() => {
		let disciplinesListUrl = baseUrl + "getDisciplines/";

		const dListReqOptions = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "origin",
				Authorization: "Bearer " + userData.auth_token,
			},
		};

		const dListReq = new Request(disciplinesListUrl, dListReqOptions);

		fetch(dListReq)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				setDisciplinesList(data);
			});
	}, [userData]);

	React.useEffect(() => {
		if (selectedDiscipline != -1) {
			let studentsListUrl = baseUrl + "getStudentsForDiscipline/" + selectedDiscipline;

			const sListReqOptions = {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "origin",
					Authorization: "Bearer " + userData.auth_token,
				},
			};

			const sListReq = new Request(studentsListUrl, sListReqOptions);

			fetch(sListReq)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					dataTableModel.rows = data;

					setDataTableModel({ columns: dataTableColumns, rows: data });
				});
		}
	}, [userData, selectedDiscipline]);

	React.useEffect(() => {
		if (selectedStudent != -1) {
			setMessage("");
		}
	}, [userData, selectedStudent]);

	return (
		<>
			<div className="Grades-main">
				<div className="Students-view">
					<select
						className="Discipline-selector"
						onChange={(e) => {
							setSelectedDiscipline(e.target.value);
						}}
						value={selectedDiscipline}
					>
						<option value="-1">--Select--</option>
						{disciplinesList.map((d) => {
							return (
								<option key={d.disciplineId} value={d.disciplineId}>
									{d.disciplineId + " - " + d.disciplineName}
								</option>
							);
						})}
					</select>
					<MDBDataTable scrollX striped bordered maxHeight="50%" data={dataTableModel} />
				</div>
				<div className="Grades-form">
					<IdForm discipline={selectedDiscipline} set={setSelectedStudent} msg={message} />
					<GradeForm user={userData} discipline={selectedDiscipline} student={selectedStudent} set={setSelectedStudent} setMsg={setMessage} />
				</div>
			</div>
		</>
	);
}

export default AddGrades;
