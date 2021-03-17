import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import { useAuth } from '../states/userState';
import nicknames from '../assets/nicknames';
import defaultProfileImage from '../images/default-profile-img.jpg';
import firebase from 'firebase/app';
import 'firebase/storage';
import imageCompression from 'browser-image-compression';

const Profile = () => {
  const { logout, user, usersCollection } = useAuth();
  const redirect = useHistory();
  
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [last, setLast] = useState('');
  const [avg, setAvg] = useState(0);
  const [scores, setScores] = useState(null);
  const [cuteName, setCuteName] = useState('');
  const [profilePic, setProfilePic] = useState(defaultProfileImage);
  
  function handleLogOut() {
    logout();
    redirect.push('/');
  }

  useEffect(() => {
    usersCollection
      .doc(user.uid)
      .get()
      .then(function (doc) {
        if (doc.data().scores) {
          let arr = doc.data().scores.reverse();
          setScores(arr);
          setLast(
            month[arr[0].createdAt.toDate().getMonth()] +
              ' ' +
              arr[0].createdAt.toDate().getDate() +
              ', ' +
              arr[0].createdAt.toDate().getFullYear()
          );
          var sum = 0;
          for (var i = 0; i < arr.length; i++) {
            sum = sum + arr[i].score;
          }
          const const_avg = (sum / arr.length).toFixed(2);
          setAvg((sum / arr.length).toFixed(2))

          nicknames.forEach(function (nickname, index) {
            if(const_avg >= nickname.bottom){
              setCuteName(nicknames[index].name);
            }
          });
            

        } else {
          setScores(undefined);
          setLast('N/A');
        }

        setName(doc.data().firstName + ' ' + doc.data().lastName);
        setSchool(doc.data().school);
        downloadProfilePic();

      });
  }, []);

 //Uploads the file to the firebase 
   const uploadProfilePic = (file) => {
    //Forces the image to be saved as a jpeg in firebase
    const cacheControl = {
      contentType: 'image/jpeg',
      customMetadata: {
        userId: user.uid
      }
    }   

    const imageFile = file.target.files[0];
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1080,
      useWebWorker: true
    }

    /*
      The first parameter is the image we are compressing and the second parameter are the settings we chose for compressing the image
      The ref() parameter is what we are setting the path of the users profile picture in our firebase bucket
    */
    imageCompression(imageFile, options).then( (compressedFile) => {
      firebase.storage().ref('users/'+ user.uid + '/profile.jpg').put(compressedFile, cacheControl).then( () => {
        console.log("Successfully uploaded image")
      }).catch(error => {
        console.log("Error uploading image: " + error);
      });
    })

    localStorage.setItem('image', URL.createObjectURL(imageFile));
    //Sets the profilePic state to the local file the first time it's uploaded. Everytime after that it will be fetched from firebase with the downloadProfilePic() method
    setProfilePic(URL.createObjectURL(imageFile));
  }

  //Fetches the profile picture in our firebase bucket and sets the state of profilePic to it
  const downloadProfilePic = () => {
    firebase.storage().ref('users/'+ user.uid + '/profile.jpg').getDownloadURL()
    .then(imgURL => {
      console.log("successfully downloaded profile picture");
      setProfilePic(imgURL);
    }).catch(error => {
      console.log('error img ' + error);
      setProfilePic(defaultProfileImage);
    })
  }

  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const htmlOfScores =
    scores !== null && scores !== undefined
      ? scores.slice(0, 10).map((score, i) => {
          return (
            <tr key={i}>
              <td>{scores.length - i}</td>
              <td>
                {month[score.createdAt.toDate().getMonth()]}{' '}
                {score.createdAt.toDate().getDate()},{' '}
                {score.createdAt.toDate().getFullYear()}
              </td>
              <td>{score.score}</td>
            </tr>
          );
        })
      : '';

  return (
    <div className='container mw-100'>
      <div className='row profile-container'>
        <div className='col m-3 profile-user-col'>
          <Card className='profile-card' border='primary'>
            <Image
              className='profile-image'
              src={profilePic}
              roundedCircle
            />
            <input 
              type='file' 
              onChange={uploadProfilePic}
            />
            <h3 className='mt-2 mb-3 text-primary'>{name}</h3>
            <h4 className='mt-2 mb-3 text-primary'>Level: {cuteName}</h4>
            <button
              type='button'
              className='btn btn-primary py-2 px-5 mb-3'
              onClick={handleLogOut}
            >
              Log Out
            </button>
            <Card.Text className='profile-card-text'>
              <strong>Email:</strong> {user.email}
              <br />
              <strong>School:</strong> {school} <br />
            </Card.Text>
            <Card.Text className='profile-card-text'>
              <strong>Last Survey Taken:</strong> {last}
              <br />
              <strong>Total Survey's Taken:</strong>{' '}
              {scores ? scores.length : 0}
              <br />
              <strong>Average Score:</strong> {avg} points
              <br />
            </Card.Text>
            <div className='profile-center-container'>
              <Link
                to='/questionnaire'
                className='btn btn-primary py-2 px-5 mb-3'
              >
                Take Survey
              </Link>
            </div>
          </Card>
        </div>

        <div className='col m-3 profile-table-col'>
          <Card className='profile-card' border='primary'>
            <h3 className='mb-0 text-primary'>Survey History</h3>
            {scores && (
              <Table striped borderless hover className='mb-0'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>{htmlOfScores}</tbody>
              </Table>
            )}
            {scores === undefined && <h1>No scores</h1>}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;