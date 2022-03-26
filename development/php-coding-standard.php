<?php

use PhpCsFixer\Fixer\Basic\BracesFixer;
use Symfony\Component\DependencyInjection\Loader\Configurator\ContainerConfigurator;
use Symplify\EasyCodingStandard\ValueObject\Option;
use Symplify\EasyCodingStandard\ValueObject\Set\SetList;

return static function (ContainerConfigurator $containerConfigurator): void {
	$parameters = $containerConfigurator->parameters();

	$parameters->set(Option::PARALLEL, true);

	// Files to include or exclude
	$parameters->set(Option::PATHS, [
		__DIR__ . '/..',
	]);
	$parameters->set(Option::SKIP, [
		__DIR__ . '/../distribution',
		__DIR__ . '/../node_modules',
		__DIR__ . '/../testing',
	]);

	// Rule sets
	$containerConfigurator->import(SetList::PSR_12);

	// Tabs
	$parameters->set(Option::INDENTATION, 'tab');
};
