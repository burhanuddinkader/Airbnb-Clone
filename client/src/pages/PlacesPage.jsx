import {Link, useParams} from 'react-router-dom';
import {useState} from 'react'
import Perks from '../Perks'
import axios from 'axios'

export default function PlacesPage(){
    const {action}=useParams();

    const {id} = useParams();
    const [title,setTitle] = useState('');
    const [address,setAddress] = useState('');
    const [addedPhotos,setAddedPhotos] = useState([]);
    const [description,setDescription] = useState('');
    const [perks,setPerks] = useState([]);
    const [extraInfo,setExtraInfo] = useState('');
    const [checkIn,setCheckIn] = useState('');
    const [checkOut,setCheckOut] = useState('');
    const [maxGuests,setMaxGuests] = useState(1);
    const [price,setPrice] = useState(100);
    const [photoLink, setphotoLink]= useState('');
    const [redirect,setRedirect] = useState(false);


    function inputHeader(text) {
        return (
          <h2 className="text-2xl mt-4">{text}</h2>
        );
      }
      function inputDescription(text) {
        return (
          <p className="text-gray-500 text-sm">{text}</p>
        );
      }
      function preInput(header,description) {
        return (
          <>
            {inputHeader(header)}
            {inputDescription(description)}
          </>
        );
      }

      async function addPhotoByLink(ev){
        ev.preventDefault();
        const {data}=await axios.post('/upload-by-link',{
          link: photoLink
        })
        console.log(data);
        setAddedPhotos(prev=>{
          return [...prev,data];
        })
        setphotoLink('');
      }


      // function savePlace(ev){
      //   ev.preventdefault();
      //   async axios.post('/',{

      //   })
      // }

    return(
        <div>
            {action !== 'new' && (
                <div className="text-center">
                    <Link  className='bg-primary text-white rounded-full px-6 py-2 inline-flex gap-1' to='/account/places/new'>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add new Place
                    </Link>
                </div>  
            )}
            {action === 'new' && (
                      <form>
                      {preInput('Title', 'Title for your place. should be short and catchy as in advertisement')}
                      <input type="text" placeholder="title, for example: My lovely apt" value={title} onChange={ev=>setTitle(ev.target.value)}/>
                      {preInput('Address', 'Address to this place')}
                      <input type="text" placeholder="address" value={address} onChange={ev=>setAddress(ev.target.value)}/>
                      {preInput('Photos','more = better')}
                      <div className="flex gap-2">
                        <input 
                        value={photoLink  }
                        onChange={ev=>setphotoLink(ev.target.value)}
                        type="text"  placeholder='Add using a link ... jpg'/>
                        <button onClick={addPhotoByLink} className="bg-gray-200 px-4 rounded-2xl">Add&nbsp;Photos</button>
                      </div>
                      <div>
                        {addedPhotos.length > 0 && addedPhotos.map(link=>(
                          <div>
                            <img src={"http://127.0.0.1:3000/uploads/"+link} alt="" />
                          </div>
                        ))}
                        <button>
                          
                        </button>
                      </div>
                      {preInput('Description','description of the place')}
                      <textarea value={description} onChange={ev=>setDescription(ev.target.value)}/>
                      {preInput('Perks','select all the perks of your place')}
                      <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                        <Perks selected={perks} onChange={setPerks} />
                      </div>
                      {preInput('Extra info','house rules, etc')}
                      <textarea value={extraInfo} onChange={ev=>setExtraInfo(ev.target.value)}/>
                      {preInput('Check in&out times','add check in and out times, remember to have some time window for cleaning the room between guests')}
                      <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
                        <div>
                          <h3 className="mt-2 -mb-1">Check in time</h3>
                          <input type="text"
                                placeholder="14"
                                value={checkIn} 
                                onChange={ev=>setCheckIn(ev.target.value)}/>
                        </div>
                        <div>
                          <h3 className="mt-2 -mb-1">Check out time</h3>
                          <input type="text"
                                 placeholder="11" 
                                 value={checkOut} 
                                 onChange={ev=>setCheckOut(ev.target.value)}
                                 />
                        </div>
                        <div>
                          <h3 className="mt-2 -mb-1">Max number of guests</h3>
                          <input type="number" value={maxGuests} onChange={ev=>setMaxGuests(ev.target.value)}/>
                        </div>
                        <div>
                          <h3 className="mt-2 -mb-1">Price per night</h3>
                          <input type="number" value={price} onChange={ev=>setPrice(ev.target.value)}/>
                        </div>
                      </div>
                      <button className="primary my-4">Save</button>
                    </form> 
            )}

        </div>

    )
}