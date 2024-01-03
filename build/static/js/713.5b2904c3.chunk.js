"use strict";(self.webpackChunkvideo_web_app=self.webpackChunkvideo_web_app||[]).push([[713],{11713:function(s,e,a){a.r(e);var r=a(29439),i=a(72791),l=a(23760),t=a(58308),n=a(94294),d=a(29569),o=a(3710),c=a(11087),m=a(26727),u=a(55705),w=a(61224),x=a(80184),h=m.Ry().shape({email:m.Z_().required("Email is required").email("Invalid email address"),password:m.Z_().required("Password is required").min(8,"Password must be at least 8 characters").matches(/[A-Z]/,"Password must include at least one capital letter").matches(/[0-9]/,"Password must include at least one number").matches(/[!@#$%^&*]/,"Password must include at least one special character (!@#$%^&*)"),confirmPassword:m.Z_().required("Confirm Password is required").oneOf([m.iH("password"),null],"Passwords must match")});e.default=function(){var s=(0,i.useState)(!1),e=(0,r.Z)(s,2),a=e[0],m=e[1],p=(0,i.useState)(!1),f=(0,r.Z)(p,2),j=f[0],v=f[1],N=(0,i.useContext)(w.V).signup;return(0,x.jsxs)("div",{className:"h-screen flex gap-28 items-center justify-center bg-[#F4F7FA]",children:[(0,x.jsx)("img",{className:"max-w-md",src:l.Z,alt:""}),(0,x.jsx)(u.J9,{initialValues:{email:"",password:"",confirmPassword:""},validationSchema:h,onSubmit:function(s){N({email:s.email,password:s.password})},children:function(s){var e=s.values,r=s.errors,i=s.touched,l=s.handleChange,u=(s.handleBlur,s.handleSubmit);return(0,x.jsxs)("div",{className:"flex flex-col bg-white p-10",children:[console.log(i,r),(0,x.jsx)("div",{children:(0,x.jsx)("p",{className:"text-2xl text-[#6358DD] font-bold mb-10",children:"Create Account"})}),(0,x.jsx)(t.Z,{className:"w-80",label:"Email",variant:"outlined",id:"email",name:"email",value:e.email,onChange:l("email")}),i.email&&r.email&&(0,x.jsx)("p",{className:"text-red-500",children:r.email}),(0,x.jsxs)("div",{className:"relative mt-10",children:[(0,x.jsx)(t.Z,{className:"w-80",label:"Password",variant:"outlined",type:a?"text":"password",id:"password",name:"password",value:e.password,onChange:l("password")}),(0,x.jsx)("div",{className:"absolute top-[50%] translate-y-[-50%] right-2 cursor-pointer",onClick:function(){return m(!a)},children:a?(0,x.jsx)(d.Z,{}):(0,x.jsx)(o.Z,{})})]}),i.password&&r.password&&(0,x.jsx)("p",{className:"text-red-500",children:r.password}),(0,x.jsxs)("div",{className:"relative mt-10",children:[(0,x.jsx)(t.Z,{className:"w-80",label:"Confirm Password",variant:"outlined",type:j?"text":"password",id:"confirmPassword",name:"confirmPassword",value:e.confirmPassword,onChange:l("confirmPassword")}),(0,x.jsx)("div",{className:"absolute top-[50%] translate-y-[-50%] right-2 cursor-pointer",onClick:function(){return v(!j)},children:j?(0,x.jsx)(d.Z,{}):(0,x.jsx)(o.Z,{})})]}),i.confirmPassword&&r.confirmPassword&&(0,x.jsx)("p",{className:"text-red-500",children:r.confirmPassword}),(0,x.jsx)("div",{className:"w-full mt-10",children:(0,x.jsx)(n.Z,{className:"w-full",variant:"contained",onClick:u,children:"SIGN UP"})}),(0,x.jsxs)("div",{className:"flex items-center justify-end mt-10",children:[(0,x.jsx)("p",{className:"text-gray-400 mr-2",children:"Already have an account?"}),(0,x.jsx)(c.rU,{to:"/",className:"text-sm text-[#6358DD] font-semibold",children:"SIGN IN"})]})]})}})]})}}}]);
//# sourceMappingURL=713.5b2904c3.chunk.js.map