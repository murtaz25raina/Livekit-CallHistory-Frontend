export function getCurrentTimeString(): string {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
  
 export function getTimeDifference(startTime: string, endTime: string): string {
    if(startTime === "" || endTime === "" )
    return "00:00:00";

    const [startHours, startMinutes, startSeconds] = startTime.split(':').map(Number);
    const [endHours, endMinutes, endSeconds] = endTime.split(':').map(Number);
  
    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, startSeconds, 0); // Set milliseconds to 0
  
    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, endSeconds, 0); // Set milliseconds to 0
  
    let diffMilliseconds = endDate.getTime() - startDate.getTime();
    if (diffMilliseconds < 0) {
      // Handle case where endTime is on the next day
      endDate.setDate(endDate.getDate() + 1);
      diffMilliseconds = endDate.getTime() - startDate.getTime();
    }
  
    const diffSeconds = Math.floor((diffMilliseconds / 1000) % 60);
    const diffMinutes = Math.floor((diffMilliseconds / 1000 / 60) % 60);
    const diffHours = Math.floor((diffMilliseconds / 1000 / 60 / 60) % 24);
  
    const formattedHours = String(diffHours).padStart(2, '0');
    const formattedMinutes = String(diffMinutes).padStart(2, '0');
    const formattedSeconds = String(diffSeconds).padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
  