const paginate = ({ result, count, limit, page }) => {
  const totalPages = Math.ceil(count / limit);

  const nextPage = page + 1 <= totalPages ? page + 1 : null;
  const firstShow=1;
  let getFirst = ((page-1)*limit)+1;
  let getLast=0;
  if(page+1 <=totalPages){
     getLast = ((page-1)*limit)+limit;
  }else{
    getLast = ((page-1)*limit)+result.length;
  }
  const DataShow=getFirst+"-"+getLast;


  const prevPage = page > 1 ? page - 1 : null;

  return {
    data: result,
    nextPage,
    currentPage: page,
    totalPages,
    prevPage,
    totalData:count,
    DataShow
  };
};

module.exports = paginate;
