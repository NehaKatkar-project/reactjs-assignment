import React from 'react'
import './Customer.css';
import { useState, useEffect } from 'react';


const Customer = props => {

    var monthNames = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const [showTable, setShowTable] = useState(false);
    const [data, setData] = useState([]);
    const [userRewards, setUserRewards] = useState(false);

    useEffect(() => {
        async function getData() {
            const get = await fetch("http://localhost:4000/records")
            const res = await get.json();
            console.log(res);
            setData(res);
        }
        getData()
    }, [])

    const calculateData = ()=>{
     //group by user id
     const result = Object.groupBy(data,({ user_id})=>user_id);
     console.log(result);
     const userRewardsArray=[];
     for(const [userId,value] of Object.entries(result)){
        console.log('user_id:'+userId);
        let bymonth = Object.groupBy(value,({date})=>new Date(date).getMonth());
        for(const[key,value] of Object.entries(bymonth)){
            //month
            console.log(monthNames[new Date(key).getMonth()+1]);
            let totalValue = 0;
            let rewardsPoint =0;
            let rewardsPointOfMonth=0;
            for(const trt of Object.entries(value)){
                trt.forEach(etr=>{
                    if(etr.transaction_amount >0)
                    {
                        totalValue=totalValue + etr.transaction_amount;
                        //convert to point
                        if(etr.transaction_amount>100)
                        {
                            let rem =etr.transaction_amount-100;
                            rewardsPoint=(rem*2)+50;
                        }else
                        {
                            let rem =etr.transaction_amount-50;
                            rewardsPoint=rem   
                        }
                        console.log("Transction"+etr.transaction_amount+",Rewards Points=" +rewardsPoint);
                        rewardsPointOfMonth+= rewardsPoint;
                       }
                })
            }
            console.log("Total spend=" +totalValue);
            console.log("Total Rewards Point=" +rewardsPointOfMonth);
            console.log("=============================================================");
            userRewardsArray.push({"User_Id":userId,"Month":monthNames[new Date(key).getMonth()+1],"Total_spend":totalValue,"Total_Rewards_Points":rewardsPointOfMonth});
        
        }
     }

     setUserRewards(userRewardsArray);
     setShowTable(true);
    }

    return (
        <div>
            <h1>Customer Data</h1>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>user_id</th>
                            <th>customer_name</th>
                            <th>transaction_amount</th>
                            <th>date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((d, i) => {
                            return (

                                <tr key={i}>
                                    <th>{d.user_id}</th>
                                    <th>{d.customer_name}</th>
                                    <th>{d.transaction_amount}</th>
                                    <th>{d.date}</th>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            <div>
             <button onClick={()=>calculateData(true)}>Calculate Rewards Point</button>
             {
                showTable && 
                <table>
                    <thead>
                        <tr>
                            <th>user_id</th>
                            <th>total_spend</th>
                            <th>Month</th>
                            <th>Total_Rewards_Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {console.log("Rewards Array length:"+userRewards.length)}
                        {userRewards.map((d, i) => {
                            return (

                                <tr key={i}>
                                    <th>{d.User_Id}</th>
                                    <th>{d.Total_spend}</th>
                                    <th>{d.Month}</th>
                                    <th>{d.Total_Rewards_Points}</th>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

             }

            </div>
        </div>
    )
}


export default Customer