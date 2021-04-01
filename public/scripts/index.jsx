const StringInfo = (props) => {
    return <div>
        <div className='table_elements' idUser='user_id' >{props.userId}</div>
        <div className='table_elements'>{props.dateRegistration}</div>
        <div className='table_elements'>{props.dateLastActivity}</div>
    </div>
}

const MainComponent = (props) => {
    const [count, setCount] = React.useState([]);
    const numId = (count.length === 0) ? 1 : count.length + 1;

    React.useEffect(async () => {
        let requestGet = await fetch('/getDate');
        let message = await requestGet.json();
        setCount(message);
    }, []);

    const calculate = () => {
        let valRRxDays = Number(document.querySelector('.sting_X_days').value);
        let returningUsers = count.filter(el => el.sumOfDays >= valRRxDays);
        let installedUsers = count.filter(el => (Date.now() - new Date(el.dateRegistration)) / 86400000 >= valRRxDays);
        let num = returningUsers.length / installedUsers.length * 100;
        document.querySelector('.calculation_result').value = num.toFixed(3);
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
        let regDateValue = document.querySelector('.registr_date').value;
        let dateActivity = document.querySelector('.last_activity_date').value;
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

        document.querySelector('.last_activity_date').value = '';
        document.querySelector('.registr_date').value = '';
    };

    return (

        <div className="div_main_comp">
            <div className='table_elements'>UserID</div>
            <div className='table_elements'>Date Registration</div>
            <div className='table_elements'>Date Last Activity</div>
            <div className='table_elements' id='user_id' >{numId}</div>
            <div className='table_elements'><input type="date" className='registr_date' /></div>
            <div className='table_elements'><input type="date" className='last_activity_date' /></div>
            {
                count.map((el) => {
                    return <StringInfo userId={el.userId} dateRegistration={el.dateRegistration}
                        dateLastActivity={el.dateLastActivity} />
                })
            }
            <button onClick={addDate} >save</button>
            <button onClick={clearDB} style={{ marginLeft: 20, marginTop: 20 }} >clearDB</button>

            <input className="sting_X_days" placeholder="RR x days" type="number" style={{ marginLeft: "110px", width: "60px" }} />
            <div style={{ marginLeft: "235px", marginTop: "10px" }} ><button onClick={calculate}>Calculate</button></div>
            <div><input type="text" className="calculation_result" placeholder="result" readOnly="true" /></div>
        </div >

    );
};

ReactDOM.render(
    <MainComponent />,
    document.getElementById("main")
)
