import { ReasonPhrases, StatusCodes } from "http-status-codes";
import prisma from "../../client"
import { MONTHS, MONTHS_ORDER } from "../../utils/months_enum";

export const getMostSearchedTermByUser = async (userId: string) => {
    try{
        const user = await prisma.user.findUnique({
            where: {id: userId}
        })
    
        if(!user){
            throw {
                statusCode: StatusCodes.NOT_FOUND,
                message: ReasonPhrases.NOT_FOUND
            } 
        }
        const result = await prisma.$queryRaw`
            SELECT termSearched, COUNT(*) AS occurrences
            FROM Search
            WHERE userId = ${userId}
            GROUP BY termSearched
            ORDER BY occurrences DESC, termSearched ASC
            LIMIT 1;
            ` as [{termSearched: string, occurrences: BigInt}];

        return result;
    }catch(error){
        throw {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        }
    }
}

type CategoryUploads = {
  month: string;
  data: { categoryName: string; uploads: number; color: string | null }[];
}[];

export async function getCategoryUploads(userId: string): Promise<CategoryUploads> {
  try {
    const allCategories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        color: true,
        _count: { select: { documents: true } },
      },
      where: { userId },
      orderBy: { documents: { _count: "desc" } },
    });

    const topCategories = allCategories.slice(0, 4);
    const otherCategories = allCategories.slice(4);

    const uploadsByMonth = await prisma.document.groupBy({
      by: ["categoryId", "uploadedAt"],
      where: {
        categoryId: { not: null, in: allCategories.map((cat) => cat.id) }, // Filtra categorias válidas
        userId,
        isDeleted: false, // Ignora documentos deletados
      },
      _count: { id: true },
    });
    
    const groupedUploads: Record<string, { categoryName: string; uploads: number; color: string | null }[]> = {};

    // Inicializa os meses com categorias vazias para evitar categorias faltando
    MONTHS_ORDER.forEach(month => {
      groupedUploads[month] = allCategories.map(category => ({
        categoryName: category.name,
        uploads: 0, // Começa com zero uploads
        color: category.color,
      }));
    });

    uploadsByMonth.forEach(({ categoryId, uploadedAt, _count }) => {
      const month = MONTHS_ORDER[uploadedAt.getMonth()];
      const category = allCategories.find(cat => cat.id === categoryId);
    
      if (category) {
        // Encontra a categoria dentro do mês e soma os uploads
        const existingCategory = groupedUploads[month].find(c => c.categoryName === category.name);
        if (existingCategory) {
          existingCategory.uploads += _count.id;
        }
      }
    });

    // Retorna os meses na ordem correta
    return MONTHS_ORDER
      .filter(month => groupedUploads[month]) // Mantém apenas os meses que têm dados
      .map(month => ({
        month,
        data: groupedUploads[month],
      }));

  } catch (error) {
    throw {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR
    };
  }
}
export const getNewUploadsInYear = async (userId: string) => {
    try{
        const currentYear = new Date().getFullYear();
        const documents = await prisma.document.count({
            where: {
                userId,
                uploadedAt: {
                    gte: new Date(currentYear, 0, 1),
                    lte: new Date(currentYear, 11, 31, 23, 59, 59, 999)
                },
                isDeleted: false
            }
        })

        return documents;
    }catch(error){
        throw {
            statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            message: ReasonPhrases.INTERNAL_SERVER_ERROR
        }
    }
}

export async function getDailyUploads(userId: string): Promise<{ date: string; uploads: number }[]> {
  try {        
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 6);

      // Buscar todos os uploads dentro do intervalo
      const uploads = await prisma.document.findMany({
          where: {
              userId,
              uploadedAt: {
                  gte: sevenDaysAgo,
                  lte: today,
              },
          },
          select: {
              uploadedAt: true,
          },
      });

      // Criar um mapa para contar uploads por dia
      const uploadsMap: Record<string, number> = {};

      uploads.forEach(({ uploadedAt }) => {
          const date = uploadedAt.toISOString().split("T")[0]; // Pega apenas a data (YYYY-MM-DD)
          uploadsMap[date] = (uploadsMap[date] || 0) + 1;
      });

      // Gerar os resultados garantindo que todos os 7 dias tenham valor (mesmo que 0)
      const dailyUploads: { date: string; uploads: number }[] = [];

      for (let i = 0; i < 7; i++) {
          const date = new Date(sevenDaysAgo);
          date.setDate(sevenDaysAgo.getDate() + i);
          const formattedDate = date.toISOString().split("T")[0];

          dailyUploads.push({
              date: formattedDate,
              uploads: uploadsMap[formattedDate] || 0,
          });
      }

      return dailyUploads;
  } catch (error) {
      throw {
          statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
          message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      };
  }
}


export async function getCategoryFiles(userId: string) {
  const categories = await prisma.category.findMany({
    where: {
      userId,
    },
    select: {
      documents: true,
      name: true,
      color: true
    },
    orderBy: {
      documents: {
        _count: "desc"
      }
    },
    take: 5
  })
  
  categories.forEach((category) => {
    category.documents = category.documents.filter((doc) => !doc.isDeleted)
  })

  return categories.map((category) => {
   return {
    name: category.name,
    data: category.documents.length,
    color: category.color
  } 
  });
}

export const getStorageData = async (userId: string) => {
  const documents = await prisma.document.aggregate({
    where: {
      userId
    },
    _sum: {
      size: true
    }
  })

  return documents._sum;
}
