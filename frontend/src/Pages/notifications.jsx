import { useState,useEffect} from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5000");
export default function NotificationsPage() {
  const [notify,setNotify] = useState([]);
  useEffect(() => {
    socket.connect();
    var x=({Name:"matei"})
    socket.emit("checkstock",(x));
    return () => {
      setNotify([]);
      socket.disconnect();
    };
  }, []);
    socket.on("stockdata", (data) => {
      setNotify(data); 
    });
    var x=1;
    function iterate(){
      x++;
    }
  return (
    <div className="max-w-md mx-auto p-4">
      <div className="bg-white shadow-md rounded-lg p-4">
        {notify.map((m) => (
          <div   key={m.id} >
          <div  className="p-3 border-b last:border-b-0">
            {x}.<b>{m.Name}</b>  {m.Message}
          </div>
          {iterate()}
          </div>
        ))}
      </div>
    </div>
  );
}


