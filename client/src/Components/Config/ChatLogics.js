export const getSender=(loggedUser,users)=>{
    
       return users[0]._id===loggedUser._id? users[1].name:users[0].name
}

export const getSenderFull=(loggedUser,users)=>{
    
    return users[0]._id===loggedUser._id? users[1]:users[0]
}

export const isSameSender=(messages,m,i,userId)=>{
    
    return(
        i<messages.length-1 &&
        (messages[i+1].sender._id !== m.sender._id ||
            messages[i+1].sender._id === undefined) &&
            messages[i].sender._id !==userId
    )
}

export const isLastMessage=(messages,i,userId)=>{
    return(
        i === messages.length-1 &&
        (messages[messages.length-1].sender._id !== userId &&
        messages[messages.length-1].sender._id)
    )
}

export const addNotification=(message,notification,setNotification)=>{
    const x=0;
    notification=notification.map((noti)=>{
      if(noti.chat!=="" && noti.chat.sender._id===message.sender._id) console.log("Matched")
    });
    // var ab={
    //     chat:message,
    //     number:1
    // }
    // if(x){
    //     setNotification(notification)
    // }
    
    // else{
    //     setNotification([ab,...notification])
    // }s
}