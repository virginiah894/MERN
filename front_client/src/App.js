import React, {Component} from 'react';
import axios from 'axios';


class App extends Component{
  // initialize state
  state = {
    data:[],
    id:0,
    message:null,
    intervalIsSet:false,
    idToDelete:null,
    idToUpdate:null,
    objectToUpdate:null, 
  };
  //  when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
   componentDidMount(){
    this.getDataFromDb();
    if (!this.state.intervalIsSet){
      let interval = setInterval(this.getDataFromDb, 1000);
      this.setState({ intervalIsSet:interval});

    }
   }

  //  kill the process whenever you dont need it
  componentWillUnmount(){
    if (this.state.intervalIsSet){
      clearInterval(this.state.intervalIsSet);
      this.setState({intervalIsSet:null});
    }
  }
    // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base

  getDataFromDb =()=>{
    fetch('http://localhost:3001/api/getData')
    .then((data)=>data.json())
    .then((res)=> this.setState({data:res.data}));
  };

  // Our post method that uses backend api to create a new query into the db
  putDataToDb = (message)=> {
    let currentIds = this.state.data.map((data)=> data.id);
    let idToBeAdded =0;
    while (currentIds.includes(idToBeAdded)){
      ++idToBeAdded;
    };
    axios.post('http://localhost:3001/api/putData',{
      id:idToBeAdded,
      message:message,
    });
  };

  // Delete method that uses the api method to delete db information

  deleteFromDb = (idToDelete)=>{
    parseInt(idToDelete);
    let objIdToDelete = null;
    this.state.data.forEach((dat)=>{
      if(dat.id ==idToDelete){
      objIdToDelete=dat._id;
    }

    });
    axios.delete('http://localhost:3001/api/deleteData',{
      data:{
        id:objIdToDelete,
      },
    });
  }
  // update method which uses backend api to ocerwrite existing db info

  updateDB =(idToUpdate,upDateToApply)=>{
    let objIdToUpdate=null;
    parseInt(idToUpdate);
    this.state.date.forEach((dat)=>{
      if (dat.id == idToUpdate){
        objIdToUpdate = dat._id;
      }
    
    });
    axios.post('http://localhost:3001/api/updateData', {
    id:objIdToUpdate,
    update:{ message: upDateToApply},
    });
  };
  // UI
  render(){
    const {data} = this.state;
    return (
      <div>
        <ul>
          {data.length <=0
          ? "NO DB ENTRIES YET" : data.map((dat)=>(

            <li style={{ padding: '10px' }} key={data.message}>
            <span style={{ color: 'gray' }}> id: </span> {dat.id} <br />
            <span style={{ color: 'gray' }}> data: </span>
            {dat.message}
          </li>
        ))}
  </ul>
  <div style={{ padding: '10px' }}>
    <input
      type="text"
      onChange={(e) => this.setState({ message: e.target.value })}
      placeholder="add something in the database"
      style={{ width: '200px' }}
    />
    <button onClick={() => this.putDataToDB(this.state.message)}>
      ADD
    </button>
  </div>
  <div style={{ padding: '10px' }}>
    <input
      type="text"
      style={{ width: '200px' }}
      onChange={(e) => this.setState({ idToDelete: e.target.value })}
      placeholder="put id of item to delete here"
    />
    <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
      DELETE
    </button>
  </div>
  <div style={{ padding: '10px' }}>
    <input
      type="text"
      style={{ width: '200px' }}
      onChange={(e) => this.setState({ idToUpdate: e.target.value })}
      placeholder="id of item to update here"
    />
    <input
      type="text"
      style={{ width: '200px' }}
      onChange={(e) => this.setState({ updateToApply: e.target.value })}
      placeholder="put new value of the item here"
    />
    <button
      onClick={() =>
        this.updateDB(this.state.idToUpdate, this.state.updateToApply)
      }
    >
      UPDATE
    </button>
  </div>
</div>
);
  }

}

export default App;
