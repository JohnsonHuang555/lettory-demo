/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from "react";

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
  const [defaultSize, setDefaultSize] = useState(5)

  // const topThree = getTopThree(totalNumberCount);

  useEffect(() => {
    const fetchNewNumbers = async () => {
      const res = await fetch(`https://api.taiwanlottery.com/TLCAPIWeB/Lottery/BingoResult?openDate=2025-02-04&pageNum=1&pageSize=${defaultSize}`)
      const data = await res.json();
      const newData = data.content.bingoQueryResult.reduce((acc: any, current: any) => {
        acc.push(current.bigShowOrder);
        return acc;
      }, []).flat();

      const occurrences = countOccurrences(newData.map((a: any) => Number(a)));
      setTotalNumberCount(occurrences)
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
      default:
        return 'bg-red-900 text-white';
    }
  }

  return (
    <div className="p-12">
      <main className="flex flex-col justify-center items-center">
        {/* <h2 className="mb-4">期數</h2>
        <div className="flex gap-4 mb-8">
          {topThree?.map(t => (<div key={t} className="text-lg border rounded-md px-4 py-2 flex items-center justify-center">{t}</div>))}
        </div> */}
        <div className="flex mb-8">
          <div>期數</div>
          <select className="ml-2 w-[100px] border" defaultValue={defaultSize} onChange={(e) => setDefaultSize(Number(e.target.value))}>
            <option value={3}>3</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
          </select>
        </div>
        {totalNumberCount ? <div className="w-[1000px] grid grid-cols-8 gap-3">
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
