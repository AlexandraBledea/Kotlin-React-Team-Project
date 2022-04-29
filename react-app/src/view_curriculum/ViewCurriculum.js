import React from "react";
import "./ViewCurriculum.css";
import { UserContext } from "../App";

let url = 'localhost:1337/view_curriculum?q=react';

function Discipline({curr_discipline, index}) {

    return (

        <React.Fragment key={index}>
            <tr>
                <td className="Curriculum-table-body-item">{curr_discipline.discipline_type}</td>
                <td className="Curriculum-table-body-item">{curr_discipline.discipline_name}</td>
                <td className="Curriculum-table-body-item">{curr_discipline.teacher_name}</td>
                <td className="Curriculum-table-body-item">{curr_discipline.credit_count}</td>
            </tr>
        </React.Fragment>
    );
}

function DisciplineList({discipline_array}) {

    return (
        <>
            {
                discipline_array.map((discipline, i) => <Discipline curr_discipline={discipline} index={i}/>)
            }
        </>
    );
}

function ViewCurriculum() {

    let [disciplines, setDisciplines] = React.useState([]);

    const userData = React.useContext(UserContext);

    React.useEffect(() => {

        url += "&user_id=" + userData.user_id + "&full_name=" + userData.full_name;

        // data = [{discipline_type: mandatory/optional, discipline_name: ..., teacher_name: ..., credit_count: ...}, ...]

        /*
        fetch(url)
            .then(response => response.json())
            .then(data => setDisciplines(data));

         */

        setDisciplines([
            {discipline_type: "mandatory", discipline_name: "Systems For Design & Implementation", teacher_name: "Dr. Gayceanu", credit_count: 6},
            {discipline_type: "optional", discipline_name: "A/V Data Processing", teacher_name: "Forest", credit_count: 4}
        ]);
    }, [userData.user_id, userData.full_name]);

    return (
        <>
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
                    <DisciplineList discipline_array={disciplines}/>
                </tbody>
            </table>
        </>
    );

}

export default ViewCurriculum;

