import { Fragment, useCallback, useEffect, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react"

const commands = [
  { id: 1, title: "Option 1", description: "Optional description 1", action: "/go" },
  { id: 2, title: "Option 2", description: "Optional description 2", action: "/go" },
  { id: 3, title: "Option 3", description: "Optional description 3", action: "/go" },
  { id: 4, title: "Option 4", description: "Optional description 4", action: "/go" },
  { id: 5, title: "Option 5", description: "Optional description 5", action: "/go" },
]

function CommandPalette() {
  const [commandBar, showCommandBar] = useState(false);
  const [query, setQuery] = useState('');
  const filteredCommands = query
    ? commands.filter((command) => command.title.toLowerCase().includes(query.toLowerCase()) || command.description.toLowerCase().includes(query.toLowerCase()))
    : []

  const command = useCallback((event) => {
    if ((event.metaKey || event.ctrlKey) && event.code === "KeyK") {
      showCommandBar(!commandBar);
    }

    if (event.code === "Escape") {
      showCommandBar(false);
    }
  }, [commandBar])

  useEffect(() => {
    document.addEventListener("keydown", command);

    return () => {
      document.removeEventListener("keydown", command);
    }
  }, [command])

  return (
    <Transition.Root show={commandBar} as={Fragment}>
      <Dialog onClose={(event) => {
        if (event.code === "Escape") {
          showCommandBar(false);
        }
      }}
        className="fixed inset-0 p-4 pt-[25vh] overflow-y-auto">
        <Transition.Child
          enter="duration-300 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-200 ease-out"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <Dialog.Overlay className="fixed inset-0 bg-gray-500/75" />
        </Transition.Child>

        <Transition.Child
          enter="duration-300 ease-out"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="duration-200 ease-out"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95">
        <Combobox className="relative max-w-xl mx-auto bg-white divide-y shadow-2xl rounded-xl ring-1 ring-black/5"
          as="div"
          onChange={() => {
            setQuery('');
            showCommandBar(false);
          }}>
          <Combobox.Input className="w-full h-12 px-4 py-8 text-sm text-gray-800 placeholder-gray-400 bg-transparent border-0 focus:ring-0"
            placeholder="Search"
            onChange={(event) => setQuery(event.target.value)} />
          {filteredCommands.length > 0 && (
            <Combobox.Options static className="py-4 overflow-hidden overflow-y-auto text-sm max-h-96">
              {filteredCommands.map((command) => (
                <Combobox.Option key={command.id} value={command}>
                  {({ active }) => (
                    <div className={`space-x-1 px-4 py-2 ${active ? 'bg-indigo-600' : 'bg-white'}`}>
                      <span className={`font-medium ${active ? 'text-white' : 'text-gray-900'}`}>
                        {command.title}
                      </span>

                      {command.description && (
                        <span className={active ? 'text-indigo-200' : 'text-gray-400'}>
                          {command.description}
                        </span>
                      )}
                    </div>
                  )}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
          {query && filteredCommands.length === 0 && (
            <p className="p-4 text-sm text-gray-900">No Results Found</p>
          )}
        </Combobox>
        </Transition.Child>
      </Dialog>

    </Transition.Root>
  )
}

export default CommandPalette;
