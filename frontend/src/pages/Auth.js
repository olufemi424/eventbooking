import React, { Component } from "react";
import AuthContext from "../context/auth-context";

export class Auth extends Component {
  state = {
    email: "",
    password: "",
    isLogin: true
  };
  static contextType = AuthContext;

  swithModeHandle = () => {
    this.setState(prevState => {
      return { isLogin: !prevState.isLogin };
    });
  };

  submitHandler = e => {
    e.preventDefault();

    const { email, password } = this.state;
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
      query{
        login(email: "${email}", password:"${password}"){
          userId
          token
          tokenExpiration
        }
      }
      `
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation{
            createUser(userInput: {email: "${email}", password:"${password}"}){
              _id
              email
            }
          }
        `
      };
    }

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then(resData => {
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.userTokenExpiration
          );
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  handleChanege = e => {
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" onChange={this.handleChanege} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" onChange={this.handleChanege} />
        </div>
        <div className="form-actions">
          <button type="submit"> Submit</button>
          <button type="button" onClick={this.swithModeHandle}>
            {" "}
            Switch to {this.state.isLogin ? "Signup" : "Login"}
          </button>
        </div>
      </form>
    );
  }
}

export default Auth;
