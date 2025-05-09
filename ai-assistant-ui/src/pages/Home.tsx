import { Link } from 'react-router-dom'
import { 
  ChatBubbleBottomCenterTextIcon, 
  CakeIcon, 
  HeartIcon, 
  FireIcon 
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Chat with AI',
    description: 'Have a conversation with our AI assistant about anything you want.',
    icon: ChatBubbleBottomCenterTextIcon,
    href: '/chat'
  },
  {
    name: 'Recipe Generator',
    description: 'Create delicious recipes based on ingredients you have on hand.',
    icon: CakeIcon,
    href: '/recipe'
  },
  {
    name: 'Diet Planner',
    description: 'Get personalized diet plans tailored to your preferences and goals.',
    icon: HeartIcon,
    href: '/diet-plan'
  },
  {
    name: 'Exercise Planner',
    description: 'Receive custom workout routines to help you meet your fitness goals.',
    icon: FireIcon,
    href: '/exercise-plan'
  },
]

export default function Home() {
  return (
    <div className="py-10">
      <header>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">Welcome to AI Assistant</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <div className="px-4 py-8 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg h-auto p-6 bg-white">
              <div className="text-center pb-10">
                <h2 className="text-base font-semibold text-primary-600 tracking-wide uppercase">Powered by AI</h2>
                <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">Your personal AI assistant</p>
                <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
                  Explore recipes, diet plans, exercise routines, and more with our AI-powered assistant.
                </p>
              </div>
              
              <div className="mt-10">
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {features.map((feature) => (
                    <div key={feature.name} className="pt-6">
                      <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8 h-full">
                        <div className="-mt-6">
                          <div>
                            <span className="inline-flex items-center justify-center rounded-md bg-primary-500 p-3 shadow-lg">
                              <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                            </span>
                          </div>
                          <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">{feature.name}</h3>
                          <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                          <div className="mt-5">
                            <Link
                              to={feature.href}
                              className="text-base font-medium text-primary-600 hover:text-primary-700"
                            >
                              Try it now <span aria-hidden="true">&rarr;</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 