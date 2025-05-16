import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth.config';


// Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const AutomateIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
  </svg>
);

const TrackIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  return (
    <main className="font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">JobAgent</span>
            </div>
            <div>
              {session ? (
                <Link href="/dashboard">
                  <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all">
                    Dashboard
                  </span>
                </Link>
              ) : (
                <Link href="/auth/signin">
                  <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all">
                    Sign In
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-6">
                Let AI Apply to Jobs for You
              </h1>
              <p className="text-xl mb-8 text-white text-opacity-90">
                JobAgent helps you apply to jobs across multiple platforms automatically, so you can focus on interviews and preparing for your new role.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {session ? (
                  <Link href="/dashboard">
                    <span className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all">
                      Go to Dashboard
                    </span>
                  </Link>
                ) : (
                  <Link href="/auth/signin">
                    <span className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all">
                      Get Started
                    </span>
                  </Link>
                )}
                <a href="#features" className="inline-flex justify-center items-center px-6 py-3 border border-white border-opacity-60 text-base font-medium rounded-md text-white hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all">
                  Learn More
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative h-96 w-full">
                <div className="absolute top-0 right-0 h-80 w-80 bg-white bg-opacity-20 rounded-full filter blur-xl"></div>
                <div className="absolute bottom-0 left-0 h-64 w-64 bg-white bg-opacity-10 rounded-full filter blur-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-lg shadow-2xl w-4/5 h-4/5 backdrop-blur-sm bg-opacity-40 border border-white border-opacity-20">
                    <div className="h-full flex flex-col">
                      <div className="h-6 flex space-x-2 mb-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-white rounded-md shadow-inner p-4">
                        <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded-full w-1/2 mb-3"></div>
                        <div className="h-4 bg-gray-200 rounded-full w-4/5 mb-3"></div>
                        <div className="h-10 bg-primary-100 rounded-md mt-6 mb-3 flex items-center px-3">
                          <div className="h-4 bg-primary-300 rounded-full w-1/3"></div>
                        </div>
                        <div className="bg-green-100 border-l-4 border-green-500 p-2 mt-6 rounded-r">
                          <div className="h-3 bg-green-200 rounded-full w-3/4 mb-2"></div>
                          <div className="h-3 bg-green-200 rounded-full w-1/2"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-16 bg-white w-full" style={{ borderTopLeftRadius: '50% 100%', borderTopRightRadius: '50% 100%' }}></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How JobAgent Works
            </h2>
            <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
              Our advanced automation tools simplify your job hunt across multiple platforms
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mb-5">
                <SearchIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Job Matching</h3>
              <p className="text-gray-600">
                Set your preferences once and let JobAgent find relevant positions across LinkedIn, Indeed, Glassdoor, and more.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mb-5">
                <AutomateIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Automated Applications</h3>
              <p className="text-gray-600">
                Our bot fills out applications for you, saving countless hours of repetitive form filling.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
              <div className="bg-primary-100 rounded-full w-12 h-12 flex items-center justify-center mb-5">
                <TrackIcon />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Application Tracking</h3>
              <p className="text-gray-600">
                Keep track of all your applications in one place, with detailed status updates and performance metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose JobAgent?
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              We're revolutionizing how people find employment
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">10x</p>
              <p className="text-gray-600">More applications submitted compared to manual searching</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">85%</p>
              <p className="text-gray-600">Time saved on your job search process</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-4xl font-bold text-primary-600 mb-2">24/7</p>
              <p className="text-gray-600">Continuous job hunting while you focus on preparing</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl mb-6">
            Ready to transform your job search?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Stop spending hours submitting applications. Let JobAgent handle it while you prepare for interviews.
          </p>
          {session ? (
            <Link href="/dashboard">
              <span className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all">
                Go to Dashboard
              </span>
            </Link>
          ) : (
            <Link href="/auth/signin">
              <span className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-primary-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-all">
                Get Started Now
              </span>
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <h2 className="text-xl font-bold text-gray-900">JobAgent</h2>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center md:text-right text-gray-500 text-sm">
                © {new Date().getFullYear()} JobAgent. All rights reserved.
              </p>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between">
            <div className="flex space-x-6 md:order-2 justify-center md:justify-start">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Terms</span>
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Privacy</span>
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">Contact</span>
                Contact Us
              </a>
            </div>
            <p className="mt-8 text-center md:mt-0 md:text-left text-gray-400 text-sm md:order-1">
              Simplifying job applications across all major platforms
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}