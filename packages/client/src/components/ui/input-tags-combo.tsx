"use client";

import { Combobox, TagsInput, useCombobox, useFilter, useListCollection, useTagsInput } from "@chakra-ui/react";
import { useId, useRef } from "react";

type InputTagsComboProps = {
	label?: string;
	placeholder?: string;
	value: string[];
	onChange: (next: string[]) => void;
};

export const InputTagsCombo = ({
	label = "Tags",
	placeholder = "Add tag...",
	value,
	onChange,
}: InputTagsComboProps) => {
	const { contains } = useFilter({ sensitivity: "base" });

	const { collection, filter } = useListCollection({
		initialItems: ["React", "Chakra", "TypeScript", "Next.js", "Ark UI", "Zag.js", "N/A"],
		filter: contains,
	});

	const uid = useId();
	const controlRef = useRef<HTMLDivElement | null>(null);

	const tags = useTagsInput({
		ids: { input: `input_${uid}`, control: `control_${uid}` },
		value,
		onValueChange: (e) => onChange(e.value),
	});

	const combobox = useCombobox({
		ids: { input: `input_${uid}`, control: `control_${uid}` },
		collection,
		onInputValueChange(e) {
			filter(e.inputValue);
		},
		value: [],
		allowCustomValue: true,
		onValueChange: (e) => {
			// add selected value to tags
			tags.addValue(e.value[0]);
			// onValueChange above will fire and update RHF
		},
		selectionBehavior: "clear",
	});

	return (
		<Combobox.RootProvider value={combobox}>
			<TagsInput.RootProvider value={tags}>
				<TagsInput.Label>
					{label}
					<span style={{ color: "red" }}>*</span>
				</TagsInput.Label>

				<TagsInput.Control ref={controlRef}>
					{tags.value.map((tag, index) => (
						<TagsInput.Item key={tag} index={index} value={tag}>
							<TagsInput.ItemPreview>
								<TagsInput.ItemText>{tag}</TagsInput.ItemText>
								<TagsInput.ItemDeleteTrigger />
							</TagsInput.ItemPreview>
						</TagsInput.Item>
					))}

					<Combobox.Input unstyled asChild>
						<TagsInput.Input placeholder={placeholder} />
					</Combobox.Input>
				</TagsInput.Control>

				<Combobox.Positioner>
					<Combobox.Content>
						{collection.items.map((item) => (
							<Combobox.Item item={item} key={item}>
								<Combobox.ItemText>{item}</Combobox.ItemText>
								<Combobox.ItemIndicator />
							</Combobox.Item>
						))}
					</Combobox.Content>
				</Combobox.Positioner>
			</TagsInput.RootProvider>
		</Combobox.RootProvider>
	);
};
