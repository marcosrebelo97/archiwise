import { Request, Response } from "express"
import { 
    getCategoryFiles, 
    getCategoryUploads, 
    getDailyUploads, 
    getMostSearchedTermByUser, 
    getNewUploadsInYear, 
    getStorageData 
} from "./dashboard.service"
import { StatusCodes } from "http-status-codes";

 const dashboardQueries = async (req: Request, res: Response) => {
    const {uid} = req.session;
    const userId = uid ?? '';
    const [data, dailyUploads, monthUploadsByCategory, newUploadsInYearCount, categoriesFiles, userStorage] = await Promise.all([
        getMostSearchedTermByUser(userId),
        getDailyUploads(userId),
        getCategoryUploads(userId),
        getNewUploadsInYear(userId),
        getCategoryFiles(userId),
        getStorageData(userId)
    ]);

    const formattedData = data.map(item => ({
        ...item,
        occurrences: Number(item.occurrences), // Convertendo BigInt para Number
      }));
      const response = {
        mostSearchedTerms: formattedData,
        dailyUploads,
        monthUploadsByCategory,
        newUploadsInYearCount,
        categoriesFiles,
        userStorage
    };
    res.status(StatusCodes.OK).json(response)
}

export default {
    dashboardQueries
}
