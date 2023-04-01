import React from 'react'
import { json, redirect, useLoaderData } from 'react-router-dom';
import { createBudget, fetchData } from '../helpers';
import Intro from '../Components/Intro';
import { toast } from 'react-toastify';
import AddNewBudget from '../Components/AddNewBudget';
import AddExpenseForm from '../Components/AddExpenseForm';

//loader
export function dashboardLoader() {
  const userName = fetchData('userName');
  const budgets = fetchData('budgets');

  return { userName, budgets };
}

//action
export async function dashboardAction({ request }) {
  const data = await request.formData();
  const {_action, ...values } = Object.fromEntries(data);
  
  //new user submission
  if (_action === "newUser") {
    try {
    localStorage.setItem("userName", JSON.stringify(values.userName));
    return toast.success(`Welcome ${values.userName}`)
  } catch (e) {
    throw new Error("There was a problem creating your account.")
  }
  }
  
  if (_action === "createBudget") {
    try {
      //create budget
      createBudget({
        name: values.newBudget,
        amount: values.newBudgetAmount
      })
      return toast.success("Budget created successfully!")
    } catch (e) {
      throw new Error("There was a problem creating your budget.")
    }
  }
  if (_action === "createExpense") {
    try {
      //create expense 
      return toast.success(`Expense ${values.newExpense} created!`)
    } catch (e) {
      throw new Error("There was a problem adding your expense.")
    }
  }
  
}

//dashboard
const Dashboard = () => {
  const { userName, budgets } = useLoaderData();

  return (
    <>
      {userName ? (
        <div>
          <h1>Welcome back, <span className='accent'>{userName}</span></h1>
          <br />
          <div className='grid-sm'>
            {
              budgets && budgets.length > 0
              ?
              (
                <div className='grid-lg'>
                   <div className='flex-lg'>
              <AddNewBudget />
              <AddExpenseForm budgets={budgets} />

              </div>
            </div>
              )
              :
              (
                <div className='grid-sm'>
             <p>Personal budgeting is the secret to financial success</p>
             <p>Create a budget to get started!</p>
             <AddNewBudget />
                </div>
              )
            }
          </div>
        </div>
      ) : (<Intro />)}
    </>
  )
}

export default Dashboard
