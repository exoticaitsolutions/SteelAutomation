
function SignUp (){
return(
    <body_Login>
    <div className="container">
    <div class="login-box">
        
      <img src="login.png" alt=""/>
      <h2>Sign Up</h2>

      <form className="login-form">
      <input type="text" placeholder="E-mail" />
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <input type="password" placeholder="Confirm-Password" />
        <button>Sign Up</button>
      </form>
     
      <div className="login-btn">
     
      </div>
    </div>
    </div>
  </body_Login>
);
}
export default SignUp;