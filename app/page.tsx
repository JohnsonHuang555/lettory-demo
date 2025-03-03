/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from "react";
import { format } from "date-fns";

const countOccurrences = (arr: number[]) => {
  const result: any = {};
  arr.forEach(num => {
    result[num] = (result[num] || 0) + 1;
  });
  return result;
};

// 取得出現次數最多的前三個數字
// const getTopThree = (occurrences: any) => {
//   if (occurrences) {
//     // 將物件轉換為陣列，並根據出現次數排序
//     const sortedOccurrences = Object.entries(occurrences).sort((a: any, b: any) => b[1] - a[1]);

//     // 取前三名
//     return sortedOccurrences.slice(0, 3).map(item => item[0]);
//   }
// };

export default function Home() {
  const [totalNumberCount, setTotalNumberCount] = useState<any>();
  const [defaultSize, setDefaultSize] = useState(3);
  const [matchPeriodNumbers, setMatchPeriodNumbers] = useState<number[]>()

  // const topThree = getTopThree(totalNumberCount);

  useEffect(() => {
    const fetchNewNumbers = async () => {
      const date = format(new Date(), "yyyy-MM-dd");
      const res = await fetch(`https://api.taiwanlottery.com/TLCAPIWeB/Lottery/BingoResult?openDate=${date}&pageNum=1&pageSize=${defaultSize}`)
      const data = await res.json();
      const newData = data.content.bingoQueryResult.reduce((acc: any, current: any) => {
        acc.push(current.bigShowOrder);
        return acc;
      }, []).flat();

      const occurrences = countOccurrences(newData.map((a: any) => Number(a)));
      setTotalNumberCount(occurrences);

      const sliceNumbers = data.content.bingoQueryResult.slice(0, defaultSize).reduce((acc: any, current: any) => {
        acc.push(current.bigShowOrder);
        return acc;
      }, []).flat();

      const sliceOccurrences = countOccurrences(sliceNumbers.map((a: any) => Number(a)));
      const matchNumbers = Object.entries(sliceOccurrences).map(([key, value]) => {
        return {
          number: Number(key),
          count: Number(value),
        }
      }).filter(a => a.count === defaultSize).map(c => c.number);
      setMatchPeriodNumbers(matchNumbers);
    }

    fetchNewNumbers();
  }, [defaultSize])

  const getBgColor = (count: number) => {
    switch (count) {
      case 0:
        return '';
      case 1:
        return 'bg-red-100';
      case 2:
        return 'bg-red-200';
      case 3:
        return 'bg-red-300';
      case 4:
        return 'bg-red-400 text-white';
      case 5:
        return 'bg-red-500 text-white';
      case 6:
        return 'bg-red-600 text-white';
      case 7:
        return 'bg-red-700 text-white';
      case 8:
        return 'bg-red-800 text-white';
      case 9:
        return 'bg-red-900 text-white';
      default:
        return 'bg-red-950 text-white';
    }
  }

  return (
    <div className="p-6 sm:p-12">
      <main className="flex flex-col justify-center items-center">
        {/* <h2 className="mb-4">期數</h2>
        <div className="flex gap-4 mb-8">
          {topThree?.map(t => (<div key={t} className="text-lg border rounded-md px-4 py-2 flex items-center justify-center">{t}</div>))}
        </div> */}
        <div className="flex mb-4">
          <div>期數</div>
          <select className="ml-2 w-[100px] border" defaultValue={defaultSize} onChange={(e) => setDefaultSize(Number(e.target.value))}>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        <div className="mb-4 flex flex-col">
          <div className="mb-2">- 連續 {defaultSize} 期都開出號碼 -</div>
          {matchPeriodNumbers?.length ? <div className="flex justify-center gap-2">
            {matchPeriodNumbers.map(n => (<div className="text-[20px] text-red-500 font-semibold border-2 w-10 h-10 rounded-full flex justify-center items-center" key={n}>{n}</div>))}
          </div>: <div className="text-center font-semibold text-[20px]">無</div>}
        </div>
        <hr />
        {totalNumberCount ? <div className="w-full grid grid-cols-4 sm:grid-cols-8 gap-3">
          {Array.from({ length: 80 }).map((_, index) => (
            <div key={index} className={`flex-col h-20 border text-xl justify-center items-center flex rounded-md ${getBgColor(totalNumberCount[index + 1] || 0)}`}>
              <div className="text-[26px] mb-1">{index + 1}</div>
              <div className="text-base">次數：{totalNumberCount[index + 1] ? totalNumberCount[index + 1] : 0}</div>
            </div>
          ))}
        </div>: null}
      </main>
    </div>
  );
}
