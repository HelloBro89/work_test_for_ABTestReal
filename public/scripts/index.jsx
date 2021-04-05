const StringInfo = (props) => {
    return <div >
        <div className='table_elements' idUser='user_id' >{props.userId}</div>
        <div className='table_elements'>{props.dateRegistration}</div>
        <div className='table_elements'>{props.dateLastActivity}</div>
    </div>
}

const MainComponent = (props) => {
    const [count, setCount] = React.useState([]);
    const numId = (count.length === 0) ? 1 : count.length + 1;
    let checkPoint;

    React.useEffect(async () => {
        let time = Date.now();
        let requestGet = await fetch('/getDate');
        let message = await requestGet.json();
        let time1 = Date.now();
        let result = time1 - time + " ms";
        document.getElementById('speed_req_db').value = result;
        console.log(`${result} ms - время извлечения информации из БД`)
        message.reverse();
        setCount(message);
    }, []);

    const calculate = () => {
        let time = Date.now();

        let valRRxDays = Number(document.getElementById('sting_X_days').value);
        let returningUsers = count.filter(el => el.sumOfDays >= valRRxDays);
        let installedUsers = count.filter(el => (Date.now() - new Date(el.dateRegistration)) / 86400000 >= valRRxDays);
        let num = returningUsers.length / installedUsers.length * 100;

        let time1 = Date.now();

        num = isNaN(num) ? 0 : num;

        document.getElementById('speed_calculate').value = time1 - time + " ms";
        document.getElementById('calculation_result').value = num.toFixed(2) + "%";
        console.log(`${time1 - time} ms - время расчёта "Rolling Retention X day"`)
    };

    const clearDB = async () => {
        setCount([]);
        let requestPost = await fetch('/clearDB', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify()
        });
        let result = await requestPost.text();
        document.getElementById('speed_req_db').value = '';
        console.log(result)
    }

    const addDate = async () => {
        let regDateValue = document.getElementById('registr_date').value;
        let dateActivity = document.getElementById('last_activity_date').value;
        let dR = new Date(regDateValue).getTime();
        let dLA = new Date(dateActivity).getTime();

        if (dR > Date.now() || dLA > Date.now() || dLA < dR ||
            (regDateValue || dateActivity) === '') {
            alert(`Неверно введена дата! \n 1. Должны быть заполнены два поля: "Date Registration" и "Date Last Activity.
            \n 2.Поля "Date Registration" и  "Date Last Activity" не должны иметь дату больше текущей.
            \n 3.Поле "Date Last Activity" должно иметь дату больше, чем "Date Registration".`);
            return;
        };

        let mess = {
            userId: document.getElementById('user_id').textContent,
            dateRegistration: regDateValue,
            dateLastActivity: dateActivity,
            sumOfDays: (dLA - dR) / 86400000
        };

        let update = [mess, ...count];
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

    function setCheckPoint() {
        checkPoint = Date.now();
    };

    function setTime() {
        let currentTime = Date.now();
        checkPoint = currentTime - checkPoint + " ms";
        if (count.length > 0) {
            console.log(`${checkPoint} - время вывода значений из БД на экран`)
        }
    };

    function getTime() {
        document.getElementById('speed_render').value = checkPoint;
    };

    return (
        <div className="div_main_comp">
            <div className='table_elements' style={{ fontWeight: 600 }}>UserID</div>
            <div className='table_elements' style={{ fontWeight: 600 }}>Date Registration</div>
            <div className='table_elements' style={{ fontWeight: 600 }}>Date Last Activity</div>
            <div className='table_elements' id='user_id' >{numId}</div>
            <div className='table_elements'><input style={{ width: '140px' }} type="date" className="date_info" id='registr_date' /></div>
            <div className='table_elements'><input style={{ width: '140px' }} type="date" className="date_info" id='last_activity_date' /></div>

            <div >
                <button className="mains_buttons" onClick={addDate}>save</button>
                <button className="mains_buttons" onClick={clearDB}>clearDB</button>
                <button className="mains_buttons" onClick={calculate}>Calculate</button>
                <div style={{ marginTop: "10px", marginLeft: "280px" }}>
                    <input className='calculations' id="calculation_result" placeholder="result" readOnly="true" />
                    <input className='calculations' id="sting_X_days" placeholder="RR x days" type="number" />
                </div>
            </div>

            <div className="info">время извлечения информации из БД</div>
            <div className="info">время расчёта Rolling Retention </div>
            <div className="info" >время вывода на экран (нажать)</div>


            <div >
                <input className="speed_work" id="speed_req_db" readOnly="true" placeholder="время извлечения" />
                <input className="speed_work" placeholder="время расчёта" id="speed_calculate" readOnly="true" />
                <input className="speed_work" id="speed_render" value="время рендеринга" type="button" onClick={getTime} />
            </div>
            <div style={{ marginTop: "15px" }} >
                {setCheckPoint()}
                {
                    count.map((el) => {
                        return <StringInfo userId={el.userId} dateRegistration={el.dateRegistration}
                            dateLastActivity={el.dateLastActivity} />
                    })
                }
                {setTime()}
            </div>
        </div >
    );
};

ReactDOM.render(
    <MainComponent />,
    document.getElementById("main")
)
