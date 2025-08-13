import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { Button } from '../ui/button'


const Social = () => {
  return (
    <div className="flex flex-row items-center w-full">
        <Button variant="outline" size="lg" className="w-full cursor-pointer">
            <FcGoogle className="size-5" />
            <span className="text-sm">Continue with Google</span>
        </Button>
    </div>
  )
}

export default Social