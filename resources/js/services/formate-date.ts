
const formatMessageDateLoing = (date: string) => {

      const now = new Date();
      const inputDate  = new Date(date);

     if (isToday(inputDate)) {
        return inputDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
     } else if (isYesterDay(inputDate)) {
            return (
                "Yesterday " + inputDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                })
            )
     } else if (inputDate.getFullYear() === now.getFullYear()) {
        return inputDate.toLocaleDateString([], {
            day: "2-digit",
            month: "short",
        })
     } else {
        return inputDate.toLocaleDateString();
     }
}

const formatMessageDateShort = (date: string) => {

    const now = new Date();
    const inputDate = new Date(date);

   if (isToday(inputDate)) {
      return inputDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
      });
   } else if (isYesterDay(inputDate)) {
          return "Yesterday ";
   } else if (inputDate.getFullYear() === now.getFullYear()) {
      return inputDate.toLocaleDateString([], {
          day: "2-digit",
          month: "short",
      })
   } else {
      return inputDate.toLocaleDateString();
   }

}


const isToday = (date : Date) => {

    const today = new Date();

    return (
      date.getDate() ===  today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
}

const isYesterDay = (date: Date) => {

     const yesterday = new Date();

     yesterday.setDate(yesterday.getDate() - 1);

     return (
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
      );

}

export  { formatMessageDateLoing, formatMessageDateShort };
