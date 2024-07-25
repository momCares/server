const paginate = ({ result, count, limit, page }) => {
  const totalPages = Math.ceil(count / limit);
  const totalDataShow=result.length;
  const nextPage = page + 1 <= totalPages ? page + 1 : null;

  const prevPage = page > 1 ? page - 1 : null;

  return {
    data: result,
    nextPage,
    currentPage: page,
    totalPages,
    prevPage,
    totalData:count,
    totalDataShow
  };
};

module.exports = paginate;
