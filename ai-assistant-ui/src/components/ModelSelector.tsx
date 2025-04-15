import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid'

export type ModelOption = {
  id: string
  name: string
  provider: 'openai' | 'anthropic' | 'ollama' | 'other'
  description?: string
}

const defaultModels: ModelOption[] = [
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai', description: 'Fast and cost-effective' },
  { id: 'openai/gpt-4', name: 'GPT-4', provider: 'openai', description: 'Most capable OpenAI model' },
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic', description: 'Anthropic\'s most powerful model' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'anthropic', description: 'Balanced performance and speed' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'anthropic', description: 'Fast and efficient' },
  { id: 'ollama/llama2', name: 'Llama 2', provider: 'ollama', description: 'Open source model' },
  { id: 'ollama/mistral', name: 'Mistral', provider: 'ollama', description: 'Efficient open source model' },
]

interface ModelSelectorProps {
  selected: ModelOption
  onChange: (model: ModelOption) => void
  models?: ModelOption[]
  label?: string
  className?: string
}

export default function ModelSelector({ 
  selected, 
  onChange, 
  models = defaultModels,
  label = 'Model',
  className = ''
}: ModelSelectorProps) {
  return (
    <div className={className}>
      <Listbox value={selected} onChange={onChange}>
        {({ open }) => (
          <>
            <Listbox.Label className="block text-sm font-medium text-gray-700">{label}</Listbox.Label>
            <div className="relative mt-1">
              <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm">
                <div className="flex items-center">
                  <ProviderBadge provider={selected.provider} />
                  <span className="ml-3 block truncate">{selected.name}</span>
                </div>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {models.map((model) => (
                    <Listbox.Option
                      key={model.id}
                      className={({ active }) =>
                        `relative cursor-default select-none py-2 pl-3 pr-9 ${
                          active ? 'bg-primary-100 text-primary-900' : 'text-gray-900'
                        }`
                      }
                      value={model}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex items-center">
                            <ProviderBadge provider={model.provider} />
                            <div className="ml-3 flex flex-col">
                              <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                {model.name}
                              </span>
                              {model.description && (
                                <span className="text-xs text-gray-500">{model.description}</span>
                              )}
                            </div>
                          </div>

                          {selected ? (
                            <span
                              className={`absolute inset-y-0 right-0 flex items-center pr-4 ${
                                active ? 'text-primary-600' : 'text-primary-600'
                              }`}
                            >
                              <CheckIcon className="h-5 w-5" aria-hidden="true" />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  )
}

function ProviderBadge({ provider }: { provider: ModelOption['provider'] }) {
  let bgColor = 'bg-gray-100'
  let textColor = 'text-gray-800'
  let label = provider

  switch (provider) {
    case 'openai':
      bgColor = 'bg-green-100'
      textColor = 'text-green-800'
      break
    case 'anthropic':
      bgColor = 'bg-blue-100'
      textColor = 'text-blue-800'
      break
    case 'ollama':
      bgColor = 'bg-orange-100'
      textColor = 'text-orange-800'
      break
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${bgColor} ${textColor}`}>
      {label}
    </span>
  )
} 