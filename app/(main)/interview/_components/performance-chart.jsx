"use client";

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ResponsiveContainer, Line, Tooltip, YAxis, XAxis, CartesianGrid, LineChart } from "recharts";

const PerformanceChart = ({ assessments }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (assessments) {
      const formattedData = assessments.map((assessment) => ({
        date: format(new Date(assessment.createdAt), "MMM dd"),
        score: assessment.quizScore,
      }));
      setChartData(formattedData);
    }
  }, [assessments]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="gradient-title text-3xl md:text-4xl">
          Performance Trend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0,100]} />
              <Tooltip content={({active, payload}) => {
                if(active && payload?.length) {
                  return (
                    <div className="bg-background border rounded-lg p-2 shadow-md">
                      <p className="text-sm font-medium">
                        Score: {payload[0].value}%
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {payload[0].payload.date}
                      </p>
                    </div>
                  )
                }
              }} />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#e7e5e4"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
