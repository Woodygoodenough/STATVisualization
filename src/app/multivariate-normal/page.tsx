"use client";

import { useState } from "react";
import Scene3D from "./Scene3D";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { InlineMath } from "react-katex";

export default function MultivariateNormalPage() {
  const [muX, setMuX] = useState(0);
  const [muY, setMuY] = useState(0);
  const [sigmaX, setSigmaX] = useState(1);
  const [sigmaY, setSigmaY] = useState(1);
  const [rho, setRho] = useState(0);

  const [showConditional, setShowConditional] = useState(false);
  const [xHat, setXHat] = useState(0);

  const [showMarginal, setShowMarginal] = useState(false);

  return (
    <div className="flex h-screen w-full">
      {/* 3D Scene Container */}
      <div className="flex-1 relative">
        <Scene3D
          muX={muX}
          muY={muY}
          sigmaX={sigmaX}
          sigmaY={sigmaY}
          rho={rho}
          showConditional={showConditional}
          xHat={xHat}
          showMarginal={showMarginal}
        />
      </div>

      {/* Control Panel */}
      <div className="w-80 border-l bg-white p-4 overflow-y-auto shadow-lg z-10 flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold mb-2">Multivariate Normal</h2>
          <p className="text-sm text-slate-500 mb-4">
            Adjust the parameters to explore the joint, marginal, and conditional density.
          </p>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Means</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium"><InlineMath math="\mu_X" /></label>
                <span className="text-sm text-slate-500">{muX.toFixed(2)}</span>
              </div>
              <Slider
                value={[muX]}
                onValueChange={(v) => setMuX((v as number[])[0])}
                min={-3}
                max={3}
                step={0.1}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium"><InlineMath math="\mu_Y" /></label>
                <span className="text-sm text-slate-500">{muY.toFixed(2)}</span>
              </div>
              <Slider
                value={[muY]}
                onValueChange={(v) => setMuY((v as number[])[0])}
                min={-3}
                max={3}
                step={0.1}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Standard Deviations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium"><InlineMath math="\sigma_X" /></label>
                <span className="text-sm text-slate-500">{sigmaX.toFixed(2)}</span>
              </div>
              <Slider
                value={[sigmaX]}
                onValueChange={(v) => setSigmaX((v as number[])[0])}
                min={0.1}
                max={3}
                step={0.1}
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium"><InlineMath math="\sigma_Y" /></label>
                <span className="text-sm text-slate-500">{sigmaY.toFixed(2)}</span>
              </div>
              <Slider
                value={[sigmaY]}
                onValueChange={(v) => setSigmaY((v as number[])[0])}
                min={0.1}
                max={3}
                step={0.1}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Correlation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium"><InlineMath math="\rho" /></label>
                <span className="text-sm text-slate-500">{rho.toFixed(2)}</span>
              </div>
              <Slider
                value={[rho]}
                onValueChange={(v) => setRho((v as number[])[0])}
                min={-0.99}
                max={0.99}
                step={0.01}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Conditional Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showConditional"
                checked={showConditional}
                onChange={(e) => setShowConditional(e.target.checked)}
                className="rounded border-slate-300"
              />
              <label htmlFor="showConditional" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Show <InlineMath math="Y | X = x_{hat}" />
              </label>
            </div>
            {showConditional && (
              <div className="space-y-2 mt-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium"><InlineMath math="x_{hat}" /></label>
                  <span className="text-sm text-slate-500">{xHat.toFixed(2)}</span>
                </div>
                <Slider
                  value={[xHat]}
                  onValueChange={(v) => setXHat((v as number[])[0])}
                  min={-4}
                  max={4}
                  step={0.1}
                />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">Marginal Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="showMarginal"
                checked={showMarginal}
                onChange={(e) => setShowMarginal(e.target.checked)}
                className="rounded border-slate-300"
              />
              <label htmlFor="showMarginal" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Show Marginal <InlineMath math="X" />
              </label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
