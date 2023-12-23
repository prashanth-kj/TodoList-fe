import { useEffect, useState } from 'react';
import AxiosService from './common/ApiService.jsx';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';

function App() {
  
      let [todo,setTodo]=useState([])
      let[newTodo,setNewTodo]=useState("")
      let [filteredTodo, setFilteredTodo]=useState(todo); 
      let [page,setPage]=useState(0);


      let  createTodo=async()=>{
             try {
                  let res= await AxiosService.post('/todo/create',{
                      todo:newTodo
                  });
                  console.log(res);
                   getTodoItems();
                   setNewTodo('')
                   toast.success(res.data.message)
                 
             } catch (error) {
                console.log(error);
                toast.error(error.response.data.message || "Error Occured")
             }
      }

      let getTodoItems= async ()=>{
        try {
          
          let res=await AxiosService.get('/todo/get'); 
            setTodo(res.data.getAllTodo)  
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message || "Error Occured")
        }
      }

      let handleCheckBox= async(id)=>{
              
            try {
                  let res=await AxiosService.put(`/todo/update/${id}`) 
                    setTodo((prevTodo) =>
                    prevTodo.map((item) =>
                      item._id === id ? { ...item, status: !item.status } : item
                    )
                  );
                
                    
            } catch (error) {
                console.log(error);
                toast.error(error.response.data.message || "Error Occured")
            }
      }
      
      let handleDelete= async(id)=>{
          try {
              
              setTodo((prevTodo) => prevTodo.filter((item) => item._id !== id));
                let res= await AxiosService.delete(`/todo/delete/${id}`);
                toast.success(res.data.message)
            
          } catch (error) {
              console.log(error);
              toast.error(error.response.data.message || "Error Occured")
          }
      }
      
  useEffect(()=>{
        getTodoItems();
  },[])
  
  useEffect(() => {
    let updatedFilteredTodo;
  
        if (page === 0) {
          updatedFilteredTodo = todo;
        } else if (page === 1) {
          updatedFilteredTodo = todo.filter((e) => !e.status);
        } else if (page === 2) {
          updatedFilteredTodo = todo.filter((e) => e.status);
        }
  
      setFilteredTodo(updatedFilteredTodo);
  }, [page, todo]);
  
 
  return ( 
      <>
        <h1 className='text-center mt-5'>Todo List</h1>
         
         <div className='container-fluid'>
              <div className='row d-flex justify-content-center mt-5'>
                  <div className='col-lg-6 col-7'>
                      <input type="text"  placeholder='Enter your todo' className='form-control'  value={newTodo} onChange={(e)=>setNewTodo(e.target.value)}  required/>  
                  </div>
                  <div className='col-auto'>
                      <button className='btn addbutton'  onClick={()=>createTodo()}>Add</button>
                  </div>     
              </div>
              
              <div className='row d-flex justify-content-center mt-5'>
                    <div className='col-lg-6 col-md-8 col-sm-10 page-list'>
                        <ul>
                          <li className={page==0? 'active1' :" "} onClick={()=>setPage(0)}>All</li>
                          <li className={page==1? 'active2' :" "} onClick={()=>setPage(1)}>Pending</li>
                          <li className={page==2? 'active3' :" "} onClick={()=>setPage(2)}>Completed</li>
                        </ul>  
                    </div>      
              </div>

              <div className='row d-flex justify-content-center mt-3'>

                    <div className='col-lg-6  col-md-8 col-9  list-item todoitem '>
                        <ul>
                              <h4>My Todo's....</h4>
                              <hr /> 
                              { filteredTodo.length==0? (
                                  <p>No Todo's found</p>
                              ):(
                                filteredTodo.map((e)=>{
                                  return <li className={e.status?'strikeout':' '} key={e._id}>
                                            <div className='listelements'>
                                                <input type="checkbox" className='form-check-input mx-3'  onChange={()=>handleCheckBox(e._id)}   checked={e.status}/>
                                                <span>{e.todo}</span>
                                                <IoMdClose className='delete-icon ' size={28} color="#063308ad"  onClick={()=>handleDelete(e._id)} />
                                            </div>
                                            <hr /> 
                                      </li>

                              })
                              )  
                              }
                        </ul>
                    </div> 
                    
              </div>
        
         </div>
      </>
  )
}

export default App


