
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { loginUser, registerUser } from "../apis/UserApi"
//import { loginUser, registerUser } from "../apis/authapi"

export function AuthComponent() {
  const [Login, setLogin] = useState(true)
  const [showpassword, setshowpassword] = useState(true)
  const [onLoading, setLoading] = useState(false)

  const [name, setname] = useState("")
  const [phone, setphone] = useState("")
  const [password, setpassword] = useState("")
  const [pic, setpic] = useState<File | null>(null)

  const successmsg = (msg: string) => {
    toast.success(msg, {
      icon: "👏",
      style: { backgroundColor: "black", color: "white" },
    })
  }

  const errmsg = (msg: string) => {
    toast.error(msg, {
      icon: "🔥",
      style: { backgroundColor: "#d00000", color: "white" },
    })
  }

  const navigate = useNavigate()

  const Formdata = new FormData()
  Formdata.append("username", name)
  Formdata.append("phone", phone)
  Formdata.append("password", password)
  if (pic) Formdata.append("avatar", pic)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)
    Formdata.forEach((data)=>{
      console.log(data);
      
    })

    try {
      if (Login) {
        const res = await loginUser({ phone, password })
        console.log(res.data);
        

        if (res.data.success) {
          successmsg(res.data.message)
          localStorage.setItem("token", res.data.token)
          navigate('/home')



        } else {
          errmsg(res.data.message)
          setLogin(false)
        }
      } else {
        const res = await registerUser(Formdata)
        if (res.data.success) {
          successmsg(res.data.message)
          localStorage.setItem("token", res.data.token)
          navigate('/home')


        } else {
          errmsg(res.data.message)
        }
      }
    } catch (error) {
      console.error("Frontend Error:", error)
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }


  }

  return (
    <section className="w-full  h-full ">
      <div className="flex flex-col gap-6 max-w-md mx-auto py-8 px-4 w-full h-full">
        <div className="border border-gray-300 rounded-lg shadow-md p-6 bg-white">
          <div className="text-center mb-6 ">
            <h2 className="text-2xl font-semibold mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500">Login with your Google account</p>
          </div>

          <form onSubmit={handleAuth}>
            <div className="flex flex-col gap-6 ">
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-gray-400 bg-[#92E3A9] rounded px-4 py-2 w-full text-sm hover:bg-[#9deeb4]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login with Google
              </button>

              <div className="relative text-center text-sm text-gray-500 after:absolute after:inset-0 after:top-1/2 after:border-t after:border-gray-300">
                <span className="relative z-10 bg-white px-2">Or continue with</span>
              </div>

              <div className="flex flex-col gap-4">
                {!Login && (
                  <div className="flex flex-col gap-1">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      value={name}
                      id="name"
                      type="text"
                      placeholder="Enter Name"
                      required
                      onChange={(e) => setname(e.target.value)}
                      className="border rounded px-3 py-2 text-sm"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <input
                    value={phone}
                    id="email"
                    type="number"
                    maxLength={10}
                    minLength={10}
                    placeholder="9562840801"
                    required
                    onChange={(e) => setphone(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700"
                    >
                      Password
                    </label>
                    <a
                      className="text-xs text-black hover:underline cursor-pointer"
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <input
                    id="password"
                    value={password}
                    type={showpassword ? "text" : "password"}
                    required
                    onChange={(e) => setpassword(e.target.value)}
                    className="border rounded px-3 py-2 text-sm"
                  />
                  <div>
                    <a
                      onClick={() => setshowpassword(!showpassword)}
                      className="text-xs text-black hover:underline mt-1 inline-block cursor-pointer"
                    >
                      {!showpassword ? "View password?" : "Close password?"}
                    </a>
                  </div>
                </div>

                {!Login && (
                  <div className="flex flex-col gap-1">
                    <label htmlFor="picture" className="text-sm font-medium text-gray-700">
                      Picture
                    </label>
                    <input
                      id="picture"
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        file && setpic(file)
                      }}
                      className="border rounded px-3 py-2 text-sm"
                    />
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-gray-500">
                {Login ? "Don't" : "Already"} have an account?{" "}
                <a
                  onClick={() => setLogin(!Login)}
                  className="text-black hover:underline cursor-pointer"
                >
                  {!Login ? "Login" : "Sign up"}
                </a>
              </div>

              <button
                disabled={onLoading}
                type="submit"
                className={`w-full flex justify-center items-center bg-black text-white py-2 rounded text-sm hover:bg-gray-900 transition ${onLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
              >
                {onLoading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : Login ? (
                  "Login"
                ) : (
                  "Sign up"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}