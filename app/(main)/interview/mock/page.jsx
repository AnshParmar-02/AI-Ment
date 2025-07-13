import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Quiz from "../_components/quize-page";

const MockInterViewPage = () => {
    return (
        <div className="container mx-auto space-y-4 py-6">
            <div className="flex flex-col space-y-2 mx-2">
                <Link href={'/interview'}>
                    <Button variant="link" className="gap-2 pl-0 cursor-pointer">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Interview Preparation
                    </Button>
                </Link>

                <div>
                    <h1 className="text-6xl font-bold gradient-title">Mock Interview</h1>
                    <p className="text-muted-foreground">
                        Nervous about interviews? Don't worry! Practice with questions built just for you — based
                        on your skills and industry. Let's get started!
                    </p>
                </div>
            </div>

            <Quiz />
        </div>
    )
}

export default MockInterViewPage;