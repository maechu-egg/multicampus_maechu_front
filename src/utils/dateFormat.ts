// export const formatDate = (dateString: string) => {
//   const date = new Date(dateString);
  

//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
//   const hour = String(date.getHours()).padStart(2, '0');
//   const minute = String(date.getMinutes()).padStart(2, '0');
//   const second = String(date.getSeconds()).padStart(2, '0');
  
//   return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
// };

// export const formatDateShort = (dateString: string) => {
//   const date = new Date(dateString);
  
//   const year = date.getFullYear();
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const day = String(date.getDate()).padStart(2, '0');
  
//   return `${year}-${month}-${day}`;
// };


//서버시간
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
 
  const koreanTime = new Date(date.getTime() - (9 * 60 * 60 * 1000));

  const year = koreanTime.getFullYear();
  const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
  const day = String(koreanTime.getDate()).padStart(2, '0');
  const hour = String(koreanTime.getHours()).padStart(2, '0');
  const minute = String(koreanTime.getMinutes()).padStart(2, '0');
  const second = String(koreanTime.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

export const formatDateShort = (dateString: string) => {
  const date = new Date(dateString);

  const koreanTime = new Date(date.getTime() - (9 * 60 * 60 * 1000));

  const year = koreanTime.getFullYear();
  const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
  const day = String(koreanTime.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};