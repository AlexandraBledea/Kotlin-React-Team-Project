import React from "react";
import "./ViewCurriculum.css";
import { UserContext } from "../App";

function DisciplineList({ discipline_array }) {
	return (
		<>
			{discipline_array.map((discipline) => (
				<tr>
					<td className="Curriculum-table-body-item">{discipline.discipline_type}</td>
					<td className="Curriculum-table-body-item">{discipline.discipline_name}</td>
					<td className="Curriculum-table-body-item">{discipline.teacher_name}</td>
					<td className="Curriculum-table-body-item">{discipline.credit_count}</td>
				</tr>
			))}
		</>
	);
}

function downloadContract(userData, selectedCurriculum) {
	let url = "http://localhost:1337/http://localhost:8090/user/getCurriculumDoc/" + selectedCurriculum + "/pdf";

	const docRequestOptions = {
		method: "GET",
		headers: {
			"Content-Type": "application/pdf",
			"Access-Control-Allow-Origin": "origin",
			Authorization: "Bearer " + userData.auth_token,
		},
	};

	const docRequest = new Request(url, docRequestOptions);

	fetch(docRequest)
		.then((response) => {
			return response.blob();
		})
		.then((data) => {
			var link = document.createElement("a");
			link.href = window.URL.createObjectURL(data);
			link.download = "contract" + selectedCurriculum + ".pdf";
			link.click();
		});
}

function ViewCurriculum() {
	const userData = React.useContext(UserContext);

	let [curriculumsList, setCurriculumsList] = React.useState([]);

	let [selectedCurriculum, setSelectedCurriculum] = React.useState(-1);
	let [disciplines, setDisciplines] = React.useState([]);

	React.useEffect(() => {
		let cListUrl = "http://localhost:1337/http://localhost:8090/user/getYears/";

		const cListReqOptions = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "origin",
				Authorization: "Bearer " + userData.auth_token,
			},
		};

		const cListReq = new Request(cListUrl, cListReqOptions);

		fetch(cListReq)
			.then((response) => {
				return response.json();
			})
			.then((data) => {
				console.log(data);
				setCurriculumsList(data);
			});
	}, [userData]);

	React.useEffect(() => {
		if (selectedCurriculum != -1) {
			let dListUrl = "http://localhost:1337/http://localhost:8090/user/getCurriculum/" + selectedCurriculum;

			const dListReqOptions = {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Access-Control-Allow-Origin": "origin",
					Authorization: "Bearer " + userData.auth_token,
				},
			};

			const dListReq = new Request(dListUrl, dListReqOptions);

			fetch(dListReq)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					setDisciplines(data);
				});
		}
	}, [userData, selectedCurriculum]);

	return (
		<>
			<select
				className="Curriculum-selector"
				onChange={(e) => {
					setSelectedCurriculum(e.target.value);
				}}
				value={selectedCurriculum}
			>
				<option value="-1">--Select--</option>
				{curriculumsList.map((curriculum) => (
					<option key={curriculum.curriculumId} value={curriculum.curriculumId}>
						{curriculum.specialization + " - year " + curriculum.year_number}
					</option>
				))}
			</select>
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
			<button className="contract-btn" onClick={() => downloadContract(userData, selectedCurriculum)}>
				Download Contract Page
			</button>
		</>
	);
}

export default ViewCurriculum;
