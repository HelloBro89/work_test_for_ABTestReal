const StringInfo = (props) => {
    return <div>
        <div className='table_elements' idUser='user_id' >{props.userId}</div>
        <div className='table_elements'>{props.dateRegistration}</div>
        <div className='table_elements'>{props.dateLastActivity}</div>
    </div>
}

const MainComponent = () => {
    const [count, setCount] = React.useState([]);
    const numId = (count.length === 0) ? 1 : count.length + 1;
    let checkPoint;

    React.useEffect(async () => {

        let time1 = Date.now();
        let requestGet = await fetch('/getDate');

        let message = await requestGet.json();
        // console.log(Date.now() - time1);
        setCount(message);

    }, []);

    const calculate = () => {
        let time1 = Date.now();
        let valRRxDays = Number(document.getElementById('sting_X_days').value);
        let returningUsers = count.filter(el => el.sumOfDays >= valRRxDays);
        let installedUsers = count.filter(el => (Date.now() - new Date(el.dateRegistration)) / 86400000 >= valRRxDays);
        let num = returningUsers.length / installedUsers.length * 100;
        // console.log(Date.now() - time1);
        document.getElementById('calculation_result').value = num.toFixed(3);
    };

    const clearDB = async () => {
        let requestPost = await fetch('/clearDB', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify()
        });
        let result = await requestPost.text();
        console.log(result)
    }

    const addDate = async () => {
        let regDateValue = document.getElementById('registr_date').value;
        let dateActivity = document.getElementById('last_activity_date').value;
        let dR = new Date(regDateValue).getTime();
        let dLA = new Date(dateActivity).getTime();

        if (dR > Date.now() || dLA > Date.now() || dLA < dR ||
            (regDateValue || dateActivity) === '') {
            alert("Неверно введена дата");
            return;
        };

        let mess = {
            userId: document.getElementById('user_id').textContent,
            dateRegistration: regDateValue,
            dateLastActivity: dateActivity,
            sumOfDays: (dLA - dR) / 86400000
        };


        let update = [...count, mess];
        setCount(update);

        let requestPost = await fetch('/addDate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(mess)
        });
        let result = await requestPost.text();
        console.log(result);

        document.getElementById('last_activity_date').value = '';
        document.getElementById('registr_date').value = '';
    };

    function timer() {
        checkPoint = Date.now()
    };

    return (

        <div className="div_main_comp">
            <div className='table_elements' style={{ fontWeight: 100 }}>UserID</div>
            <div className='table_elements' style={{ fontWeight: 100 }}>Date Registration</div>
            <div className='table_elements' style={{ fontWeight: 100 }}>Date Last Activity</div>
            <div className='table_elements' id='user_id' >{numId}</div>
            <div className='table_elements'><input style={{ width: '140px' }} type="date" className="date_info" id='registr_date' /></div>
            <div className='table_elements'><input style={{ width: '140px' }} type="date" className="date_info" id='last_activity_date' /></div>
            {timer()}
            {
                count.map((el) => {
                    console.log('yo')
                    return <StringInfo userId={el.userId} dateRegistration={el.dateRegistration}
                        dateLastActivity={el.dateLastActivity} />
                })
            }
            {console.log(Date.now() - checkPoint)}

            <div>
                <button className="mains_buttons" onClick={addDate}>save</button>
                <button className="mains_buttons" onClick={clearDB}>clearDB</button>
                <button className="mains_buttons" onClick={calculate}>Calculate</button>
                <div style={{ marginTop: "10px", marginLeft: "234px" }}>
                    <input className='calculations' id="calculation_result" placeholder="result" readOnly="true" />
                    <input className='calculations' id="sting_X_days" placeholder="RR x days" type="number" />
                </div>
            </div>

            <div style={{ marginTop: "10px" }} >
                <input className="speed_work" id="speed_req_db" readOnly="true"></input>
                <input className="speed_work" id="speed_calculate" readOnly="true"></input>
                <input className="speed_work" id="speed_render" readOnly="true"></input>
            </div>
        </div >
    );
};

ReactDOM.render(
    <MainComponent />,
    document.getElementById("main")
)
