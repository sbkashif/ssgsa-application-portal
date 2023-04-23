import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { AdminPortalData } from '../../../classes/admin_portal_data'
import { ApplicationData } from '../../../classes/application_data'
import { useAuth } from '../../../context/AuthUserContext'
import { updateIntFormStatus } from '../../../pages/api/updateInterviewMarks'
import {
  InterviewerInstructionsType,
  ReviewMarksType,
  ReviewerInstructionsType,
  Users,
} from '../../../types'
import Field from '../../ReviewApplicationSteps/Field'
import Step3 from '../../ReviewApplicationSteps/Step3'
import Step4 from '../../ReviewApplicationSteps/Step4'
import Step5 from '../../ReviewApplicationSteps/Step5'
import Step6 from '../../ReviewApplicationSteps/Step6'
import ProceedButtons from './ProceedButtons'

type Props = {
  applId: string
  applicationData: ApplicationData
  adminPortalData: AdminPortalData
  reviewers: Users
  revInstructions: ReviewerInstructionsType
  intInstructions: InterviewerInstructionsType
  formStatus: number
  status: number
  setStatus: Dispatch<SetStateAction<Number>>
}

const InterviewerStep3 = ({
  applId,
  applicationData,
  adminPortalData,
  reviewers,
  revInstructions,
  intInstructions,
  formStatus,
  status,
  setStatus,
}: Props) => {
  const { authUser } = useAuth()
  const [error, setError] = useState<string>('')
  const [reviewMarks, setReviewMarks] = useState<ReviewMarksType>({})

  useEffect(() => {
    if (
      !adminPortalData ||
      !adminPortalData.review_marks ||
      !Object.keys(reviewers).length
    )
      return

    Object.keys(adminPortalData.review_marks).map((reviewerId) => {
      if (adminPortalData.review_marks[reviewerId].formStatus === 8)
        setReviewMarks((prev) => ({
          ...prev,
          [reviewerId]: adminPortalData.review_marks[reviewerId],
        }))
    })
  }, [adminPortalData, reviewers])

  return (
    <div className="w-full">
      <div className="bg-gray-200 rounded-3xl py-5 px-3 sm:py-10 sm:px-10">
        <h1 className="text-3xl text-red-850 text-center font-bold pb-5">
          Academic/Curricular Activities
        </h1>
        <div className="text-xs sm:text-sm md:text-base font-bold m-2">
          <p className="mb-5">{intInstructions.STEP3_INSTRUCTION}</p>
        </div>
      </div>

      <Step3 researchData={applicationData.research_experience} />
      <Step4 workExperiences={applicationData.work_experience} />
      <Step5 workshops={applicationData.poster_or_workshops} />
      <Step6 curricularActivities={applicationData.curricular_activities} />

      <div className="bg-gray-200 rounded-3xl py-5 px-3 sm:py-10 sm:px-10 my-5">
        <h1 className="text-xl sm:text-2xl text-center font-bold pb-5">
          Academic/Curricular Activities Marks
        </h1>
        {Object.keys(reviewMarks).map((reviewerId, index) => (
          <div className="my-5" key={index}>
            <p className="font-bold sm:text-lg font-extrabold">
              Marks given by Reviewer {reviewers[reviewerId].name}
            </p>
            <div className="ml-5 text-blue-850">
              <Field
                name={`Total Curricular Marks (out of ${revInstructions.CURRICULAR_MAX_MARKS})`}
                value={reviewMarks[reviewerId].curricularMarks}
              />
            </div>
          </div>
        ))}
      </div>

      <ProceedButtons
        formStatus={formStatus}
        status={status}
        setStatus={setStatus}
        validation={() => true}
        updateInterviewMarks={(newStatus: number) =>
          updateIntFormStatus(applId, authUser.id, newStatus)
        }
        error={error}
        setError={setError}
      />
    </div>
  )
}

export default InterviewerStep3