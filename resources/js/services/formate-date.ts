
const formatMessageDateLoing = (date: string) => {

      const now = new Date();
      const inputDate  = new Date(date);

     if (isToday(inputDate as Date)) {
        return inputDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });
     } else if (isYesterDay(inputDate as Date)) {
            return (
                "Yesterday" + inputDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            )
     } else if (inputDate.getFullYear() === now.getFullYear()) {
        return inputDate.toLocaleDateString([], {
            day: '2-digit',
            month: 'short'
        })
     } else {
        return inputDate.toLocaleDateString();
     }
}

const formatMessageDateShort = (date: string) => {

    const now = new Date();
    const inputDate = new Date(date);

   if (isToday(inputDate as Date)) {
      return inputDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
      });
   } else if (isYesterDay(inputDate as Date)) {
          return "Yesterday";
   } else if (inputDate.getFullYear() === now.getFullYear()) {
      return inputDate.toLocaleDateString([], {
          day: '2-digit',
          month: 'short'
      })
   } else {
      return inputDate.toLocaleDateString();
   }

}


const isToday = (date : Date) => {

    const today = new Date();

    return (
      today.getDate() === date.getDate() &&
      today.getMonth() === date.getMonth() &&
      today.getFullYear() === date.getFullYear()
    );
}

const isYesterDay = (date: Date) => {

     const yesterday = new Date();

     yesterday.setDate(yesterday.getDate() - 1);

     return (
        yesterday.getDate() === date.getDate() &&
        yesterday.getMonth() === date.getMonth() &&
        yesterday.getFullYear() === date.getFullYear()
      );

}

export  { formatMessageDateLoing, formatMessageDateShort };
