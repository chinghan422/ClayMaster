
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Participant, Submission } from '../types';

interface ScoreBoardProps {
  participants: Participant[];
  submissions: Submission[];
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({ participants, submissions }) => {
  const data = useMemo(() => {
    return participants.map(p => {
      const pSubmissions = submissions.filter(s => s.participantId === p.id);
      const totalScore = pSubmissions.reduce((acc, curr) => {
        // 修改：從 Record 物件取出所有分數值計算平均
        const scoreValues = Object.values(curr.scores);
        const avg = scoreValues.length > 0 ? scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length : 0;
        return acc + avg;
      }, 0);
      
      return {
        name: p.name,
        score: parseFloat(totalScore.toFixed(1)),
      };
    }).sort((a, b) => b.score - a.score);
  }, [participants, submissions]);

  const COLORS = ['#8b5e3c', '#a67c52', '#c4a484', '#d2b48c', '#e5d3b3'];

  return (
    <div className="p-6 clay-card">
      <h3 className="text-2xl font-bold text-amber-900 mb-6 flex items-center">
        <span className="mr-2">🏆</span> 目前積分排行榜
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={80} />
            <Tooltip 
              cursor={{ fill: 'rgba(139, 94, 60, 0.1)' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
