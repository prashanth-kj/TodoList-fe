import { useEffect, useState } from 'react';
import AxiosService from './common/ApiService.jsx';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import introJs from 'intro.js';
import 'intro.js/introjs.css';

function App() {
  
      let [todo,setTodo]=useState([])
      let[newTodo,setNewTodo]=useState("")
      let [filteredTodo, setFilteredTodo]=useState(todo); 
      let [page,setPage]=useState(0);
      let[loading,setLoading]=useState(false);


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
           setLoading(true);
          let res=await AxiosService.get('/todo/get'); 
            setTodo(res.data.getAllTodo)  
        } catch (error) {
          console.log(error);
          toast.error(error.response.data.message || "Error Occured")
        }finally{
             setLoading(false);
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

      useEffect(() => {
       
          setTimeout(() => {
            introJs()
              .setOptions({
                steps: [
                  {
                    element: '#app-name',
                    intro: 'Welcome! This is your personalized Todo App.',
                  },
                  {
                    element: '#inputbox',
                    intro: 'Type your tasks here to add them to your list.',
                  },
                  {
                    element: '#addbtn',
                    intro: 'Click this button to save the task you just entered.',
                  },
                  {
                    element: '#all',
                    intro: 'View all your tasks, including completed and pending ones.',
                  },
                  {
                    element: '#pending',
                    intro: 'Here you’ll see only the tasks that are still pending.',
                  },
                  {
                    element: '#completed',
                    intro: 'Check this section for tasks you’ve already completed.',
                  },
                  {
                    element: '[data-step="todos"]',
                    intro: 'This is your list of tasks. Manage them efficiently!',
                  },
                  {
                    element: '[data-step="mark"]',
                    intro: 'Mark tasks as completed by checking this box.',
                  },
                  {
                    element: '[data-step="close"]',
                    intro: 'Delete a task you no longer need by clicking this icon.',
                  },
                ],
              })
              .start();
          }, 1000); // Delay execution by 500ms
        
      }, []);
      
  

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
        <h1 className='text-center mt-5' id='app-name'>Todo List</h1>
         
         <div className='container-fluid'>
              <div className='row d-flex justify-content-center mt-5'>
                  <div className='col-lg-6 col-7' id='inputbox'>
                      <input type="text"  placeholder='Enter your todo' className='form-control'  value={newTodo} onChange={(e)=>setNewTodo(e.target.value)}  required/>  
                  </div>
                  <div className='col-auto' id='addbtn'>
                      <button className='btn addbutton'   onClick={()=>createTodo()}>Add</button>
                  </div>     
              </div>
              
              <div className='row d-flex justify-content-center mt-5'>
                    <div className='col-lg-6 col-md-8 col-sm-10 page-list'>
                        <ul>
                          <li className={page==0? 'active1' :" "} id='all' onClick={()=>setPage(0)}>All</li>
                          <li className={page==1? 'active2' :" "} id='pending' onClick={()=>setPage(1)}>Pending</li>
                          <li className={page==2? 'active3' :" "} id='completed' onClick={()=>setPage(2)}>Completed</li>
                        </ul>  
                    </div>      
              </div>

              <div className='row d-flex justify-content-center mt-3'>

                    <div className='col-lg-6  col-md-8 col-9  list-item todoitem '>
                       {
                          loading ? (
                              <div className='loader'> Loading...</div>
                          ):(

                          <ul>
                            <h4>My Todo's....</h4>
                            <hr /> 
                            { filteredTodo.length==0? (
                                <p>No Todo's found</p>
                            ):(
                              filteredTodo.map((e)=>{
                                return <li className={e.status?'strikeout':' ' }  data-step='todos' key={e._id}>
                                          <div className='listelements' >
                                              <input type="checkbox"  data-step="mark" className='form-check-input mx-3' id='checkbox'  onChange={()=>handleCheckBox(e._id)}   checked={e.status}/>
                                              <span>{e.todo}</span>
                                              <IoMdClose className='delete-icon' data-step='close'  size={28} color="#063308ad"  onClick={()=>handleDelete(e._id)} />
                                          </div>
                                          <hr /> 
                                    </li>

                            })
                            )  
                            }
                      </ul>
                      )
                       } 
                    </div> 
                    
              </div>
        
         </div>
      </>
  )
}

export default App


